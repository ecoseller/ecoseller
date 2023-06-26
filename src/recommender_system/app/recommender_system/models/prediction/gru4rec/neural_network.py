import logging
import time
from typing import Any, Dict, List

from dependency_injector.wiring import inject, Provide
import torch
import torch.backends.mps
import torch.utils.data

from recommender_system.models.prediction.gru4rec.dataset import (
    SessionDataset,
    sequence_to_tensor,
)
from recommender_system.models.prediction.gru4rec.layers import (
    ReducedLinearEmbedding,
    ReducedLinearFeedforward,
    SelectGRUOutput,
)
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.storage.gru4rec.abstract import AbstractGRU4RecStorage
from recommender_system.utils.memory import get_current_memory_usage


class NeuralNetwork:
    embedding: ReducedLinearEmbedding
    gru: torch.nn.Module
    feedforward: ReducedLinearFeedforward
    net: torch.nn.Module

    mapping: Dict[str, int]

    num_epochs: int = 1
    batch_size: int = 64

    model_identifier: str

    @property
    def model_name(self) -> str:
        from recommender_system.models.prediction.gru4rec.model import (
            GRU4RecPredictionModel,
        )

        return GRU4RecPredictionModel.Meta.model_name

    @property
    def hyperparameters(self) -> Dict[str, Any]:
        return {"num_epochs": self.num_epochs, "batch_size": self.batch_size}

    @classmethod
    @inject
    def load(
        cls,
        identifier: str,
        gru4rec_storage: AbstractGRU4RecStorage = Provide["gru4rec_storage"],
    ) -> "NeuralNetwork":
        gru4rec = cls(identifier=identifier)

        gru4rec.net = gru4rec_storage.get_module(identifier=identifier)
        gru4rec.embedding = gru4rec.net[0]
        gru4rec.gru = gru4rec.net[1]
        gru4rec.feedforward = gru4rec.net[-1]
        gru4rec.mapping = gru4rec_storage.get_mapping(identifier=identifier)

        return gru4rec

    @inject
    def __init__(
        self,
        identifier: str,
        num_product_variants: int,
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ):
        self.model_identifier = identifier
        skus = product_storage.get_objects_attribute(
            model_class=ProductVariantModel, attribute="sku"
        )
        self.mapping = {sku: i for i, sku in enumerate(skus)}
        embedding_size = 100
        hidden_size = 100
        self.embedding = ReducedLinearEmbedding(
            in_features=num_product_variants, out_features=embedding_size
        )
        self.gru = torch.nn.GRU(input_size=embedding_size, hidden_size=hidden_size)
        self.feedforward = ReducedLinearFeedforward(
            in_features=hidden_size, out_features=num_product_variants
        )
        self.net = torch.nn.Sequential(
            self.embedding,
            self.gru,
            SelectGRUOutput(),
            self.feedforward,
        )
        self.optimizer = torch.optim.SGD(self.net.parameters(), lr=0.0001)

    def loss(self, outputs: torch.Tensor) -> torch.Tensor:
        diag = torch.eye(outputs.size(dim=0)) * outputs
        return torch.mean(torch.sigmoid(outputs - diag) + torch.pow(outputs, 2))

    @property
    def num_features(self) -> int:
        return len(self.mapping.keys())

    def _get_data_loader(self) -> torch.utils.data.DataLoader:
        return torch.utils.data.DataLoader(
            dataset=SessionDataset(mapping=self.mapping, batch_size=self.batch_size),
            batch_size=1,
        )

    def _set_indices(self, inputs: torch.Tensor, labels: torch.Tensor) -> None:
        embedding_indices = torch.nonzero(torch.any(inputs != 0, dim=0)).flatten()
        self.embedding.indices = embedding_indices
        self.feedforward.indices = labels

    def train(self) -> None:
        logging.info("Training started")

        start = time.time()
        peak_memory, peak_memory_percentage = get_current_memory_usage()

        data_loader = self._get_data_loader()
        for epoch in range(self.num_epochs):

            running_loss = 0.0
            for i, batch in enumerate(data_loader):
                X, y = batch
                index = 0
                while index < X.size(dim=1):
                    if index + self.batch_size <= X.size(dim=1):
                        inputs = X[0, index : index + self.batch_size]
                        labels = y[0, index : index + self.batch_size]
                    else:
                        inputs = X[0, index:]
                        labels = y[0, index:]

                    self.optimizer.zero_grad()

                    self._set_indices(inputs=inputs, labels=labels)
                    outputs = self.net(inputs)
                    loss = self.loss(outputs[0])
                    loss.backward()
                    self.optimizer.step()

                    running_loss += loss.item()

                    index += self.batch_size

                    memory, memory_percentage = get_current_memory_usage()
                    if memory > peak_memory:
                        peak_memory, peak_memory_percentage = memory, memory_percentage

                if i % 10 == 0:
                    logging.info(f"{i + 1} / {len(data_loader)} batches processed")

            logging.info(f"epoch: {epoch + 1} done, loss: {running_loss:.4f}")

        end = time.time()

        statistics = TrainingStatisticsModel(
            model_name=self.model_name,
            model_identifier=self.model_identifier,
            duration=end - start,
            peak_memory=peak_memory,
            peak_memory_percentage=peak_memory_percentage,
            metrics={},
            hyperparameters=self.hyperparameters,
        )
        statistics.create()

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
        inputs = sequence_to_tensor(seq=seq, num_features=self.num_features)
        inputs = inputs.resize(1, inputs.size(dim=0))
        inverse_mapping = {}
        possible_labels = []
        for i, sku in enumerate(variants):
            inverse_mapping[i] = sku
            possible_labels.append(self.mapping[sku])
        possible_labels = torch.tensor(possible_labels)
        self._set_indices(inputs=inputs, labels=possible_labels)
        predictions = self.net(inputs)
        sorted_indices = torch.argsort(predictions, descending=True).flatten().tolist()
        return [inverse_mapping[i] for i in sorted_indices]

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
