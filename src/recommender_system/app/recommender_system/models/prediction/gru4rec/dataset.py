import math
from typing import Dict, List, Tuple

from dependency_injector.wiring import inject, Provide
from sqlalchemy.orm.query import Query
import torch
from torch.utils.data import Dataset

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage


def sequence_to_tensor(seq: List[int], num_features: int) -> torch.Tensor:
    row = torch.zeros(num_features)

    if len(seq) == 0:
        return row

    for item in seq:
        row = torch.mul(row, 0.9)
        row[item] = 1

    return torch.div(row, torch.sum(row))


class InnerSessionDataset(Dataset):
    mapping: Dict[str, int]
    num_features: int

    batch_size: int

    X: torch.Tensor
    y: torch.Tensor

    def __init__(
        self,
        session_sequences: List[List[str]],
        mapping: Dict[str, int],
    ):
        self.num_features = len(mapping.keys())

        X_rows = []
        y_rows = []
        for j, sequence in enumerate(session_sequences):
            filtered_sequence = [item for item in sequence if item in mapping]
            for i in range(1, len(filtered_sequence)):
                x_indices = [mapping[item] for item in filtered_sequence[:i]]
                y_index = mapping[filtered_sequence[i]]
                X_rows.append(
                    sequence_to_tensor(seq=x_indices, num_features=self.num_features)
                )
                y_rows.append(y_index)

        self.X = torch.vstack(X_rows)
        self.y = torch.tensor(y_rows)

    def __len__(self) -> int:
        return self.X.size(dim=0)

    def __getitem__(self, item) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.X[item], self.y[item]


class SessionDataset(Dataset):
    mapping: Dict[str, int]
    num_features: int
    query: Query

    batch_size: int
    inner_set_size: int = 1000

    def __init__(self, mapping: Dict[str, int], batch_size: int):
        self.mapping = mapping
        self.batch_size = batch_size
        self.num_features = len(mapping.keys())

    @inject
    def update_query(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> None:
        self.query = feedback_storage.get_session_sequences_query()

    @inject
    def __len__(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> int:
        return math.ceil(
            feedback_storage.get_session_sequences_query().count() / self.inner_set_size
        )

    def __getitem__(self, item) -> Tuple[torch.Tensor, torch.Tensor]:
        self.update_query()

        session_sequences = []
        for row in (
            self.query.limit(self.inner_set_size)
            .offset(item * self.inner_set_size)
            .all()
        ):
            session_sequences.append(row[0])

        X_rows = []
        y_rows = []
        for j, sequence in enumerate(session_sequences):
            filtered_sequence = [item for item in sequence if item in self.mapping]
            for i in range(1, len(filtered_sequence)):
                x_indices = [self.mapping[item] for item in filtered_sequence[:i]]
                y_index = self.mapping[filtered_sequence[i]]
                X_rows.append(
                    sequence_to_tensor(seq=x_indices, num_features=self.num_features)
                )
                y_rows.append(y_index)

        return torch.vstack(X_rows), torch.tensor(y_rows)
