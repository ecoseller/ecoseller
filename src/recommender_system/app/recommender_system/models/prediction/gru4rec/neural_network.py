import logging
from typing import Dict, List

from dependency_injector.wiring import inject, Provide
import torch
import torch.backends.mps
import torch.utils.data

from recommender_system.models.prediction.gru4rec.dataset import (
    SessionDataset,
    sequence_to_tensor,
)
from recommender_system.models.prediction.gru4rec.select_gru_output import (
    SelectGRUOutput,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.storage.gru4rec.abstract import AbstractGRU4RecStorage


class NeuralNetwork:
    embedding: torch.nn.Module
    gru: torch.nn.Module
    feedforward: torch.nn.Module
    net: torch.nn.Module
    device: torch.device

    mapping: Dict[str, int]

    num_epochs: int = 3

    @inject
    def __init__(
        self,
        num_product_variants: int,
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ):
        if torch.cuda.is_available():
            self.device = torch.device("cuda:0")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps:0")
        else:
            self.device = torch.device("cpu")
        self.device = torch.device("cpu")
        logging.info(f"Using device {self.device}")

        skus = product_storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku"
        )
        self.mapping = {sku: i for i, sku in enumerate(skus)}
        embedding_size = 100
        hidden_size = 100
        self.embedding = torch.nn.Linear(
            in_features=num_product_variants, out_features=embedding_size
        )
        self.gru = torch.nn.GRU(input_size=embedding_size, hidden_size=hidden_size)
        self.feedforward = torch.nn.Linear(
            in_features=hidden_size, out_features=num_product_variants
        )
        self.net = torch.nn.Sequential(
            self.embedding,
            self.gru,
            SelectGRUOutput(),
            self.feedforward,
        ).to(self.device)
        self.optimizer = torch.optim.SGD(self.net.parameters(), lr=0.0001)
        self.loss = torch.nn.CrossEntropyLoss()

    @property
    def num_features(self) -> int:
        return len(self.mapping.keys())

    def _get_data_loader(self) -> torch.utils.data.DataLoader:
        return torch.utils.data.DataLoader(
            dataset=SessionDataset(mapping=self.mapping, device=self.device),
            batch_size=1,
            shuffle=True,
        )

    def train(self) -> None:
        logging.info("Training started")

        data_loader = self._get_data_loader()
        for epoch in range(self.num_epochs):

            running_loss = 0.0
            for i, data in enumerate(data_loader, 0):
                inputs, labels = data
                inputs = inputs.to(self.device)
                labels = labels.to(self.device)

                self.optimizer.zero_grad()

                outputs = self.net(inputs)
                loss = self.loss(outputs, labels)
                loss.backward()
                self.optimizer.step()

                running_loss += loss.item()
                if i % 100 == 99:
                    logging.info(f"{i} batches processed")

            logging.info(
                f"epoch: {epoch + 1} done, loss: {running_loss / len(data_loader):.4f}"
            )

        logging.info("Training finished")

    def predict(
        self,
        session_id: str,
        variants: List[str],
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
    ) -> List[str]:
        sequences = feedback_storage.get_session_sequences(session_ids=[session_id])
        if len(sequences) == 0:
            logging.warning(f"No session sequence found for session_id={session_id}")
            seq = []
        else:
            seq = [self.mapping[item] for item in sequences[0] if item in self.mapping]
        inputs = sequence_to_tensor(seq=seq, num_features=self.num_features).to(
            self.device
        )
        inputs = inputs.resize(1, inputs.size(dim=0))
        predictions = self.net(inputs)
        scores = {
            sku: predictions[0][self.mapping[sku]] if sku in self.mapping else 0
            for sku in variants
        }
        ordered_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        return [item[0] for item in ordered_scores]

    @inject
    def save(
        self,
        identifier: str,
        gru4rec_storage: AbstractGRU4RecStorage = Provide["gru4rec_storage"],
    ) -> None:
        gru4rec_storage.store_module(module=self.net, identifier=identifier)
        gru4rec_storage.store_mapping(mapping=self.mapping, identifier=identifier)

    @classmethod
    @inject
    def delete(
        cls,
        identifier: str,
        gru4rec_storage: AbstractGRU4RecStorage = Provide["gru4rec_storage"],
    ) -> None:
        gru4rec_storage.delete_module(identifier=identifier)
        gru4rec_storage.delete_mapping(identifier=identifier)
