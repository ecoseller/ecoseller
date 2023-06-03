import logging
from typing import Dict

from dependency_injector.wiring import inject, Provide
import torch
import torch.backends.mps
import torch.utils.data

from recommender_system.models.prediction.gru4rec.dataset import SessionDataset
from recommender_system.models.prediction.gru4rec.select_gru_output import (
    SelectGRUOutput,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
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
        )
        self.optimizer = torch.optim.SGD(self.net.parameters(), lr=0.0001)
        self.loss = torch.nn.CrossEntropyLoss()
        if torch.cuda.is_available():
            self.device = torch.device("cuda:0")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps:0")
        else:
            self.device = torch.device("cpu")
        self.net.to(self.device)
        logging.info(f"Using device {self.device}")

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
