from datetime import datetime
import math
from typing import Dict, List, Optional, Tuple, Union

from dependency_injector.wiring import inject, Provide
from sqlalchemy.orm.query import Query
import torch
from torch.utils.data import Dataset

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.utils.data_loader_type import DataLoaderType


def sequence_to_tensor(seq: List[int], num_features: int) -> torch.Tensor:
    row = torch.zeros(num_features)

    if len(seq) == 0:
        return row

    for item in seq:
        row = torch.mul(row, 0.9)
        row[item] = 1

    return torch.div(row, torch.sum(row))


class SessionDataset(Dataset):
    mapping: Dict[str, int]
    num_features: int
    query: Query

    batch_size: int
    inner_set_size: int = 1000
    loader_type: DataLoaderType

    def __init__(
        self,
        mapping: Dict[str, int],
        batch_size: int,
        loader_type: DataLoaderType,
        date_from: Optional[datetime],
    ):
        self.mapping = mapping
        self.batch_size = batch_size
        self.num_features = len(mapping.keys())
        self.loader_type = loader_type
        self.date_from = date_from

    @inject
    def update_query(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> None:
        self.query = feedback_storage.get_session_sequences_query(
            date_from=self.date_from
        )

    @inject
    def __len__(
        self, feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"]
    ) -> int:
        query = feedback_storage.get_session_sequences_query(date_from=self.date_from)
        return math.ceil(query.count() / self.inner_set_size)

    def __getitem__(self, item) -> Tuple[torch.Tensor, Union[torch.Tensor, list]]:
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
            if self.loader_type == DataLoaderType.TRAIN:
                filtered_sequence = filtered_sequence[
                    : math.floor(0.75 * len(filtered_sequence))
                ]
            if self.loader_type == DataLoaderType.TEST:
                train_sequence = filtered_sequence[
                    : math.floor(0.75 * len(filtered_sequence))
                ]
                test_sequence = filtered_sequence[
                    math.floor(0.75 * len(filtered_sequence)) :
                ]
                x_indices = [self.mapping[item] for item in train_sequence]
                y_indices = [self.mapping[item] for item in test_sequence]
                X_rows.append(
                    sequence_to_tensor(seq=x_indices, num_features=self.num_features)
                )
                y_rows.append(y_indices)
            else:
                for i in range(1, len(filtered_sequence)):
                    x_indices = [self.mapping[item] for item in filtered_sequence[:i]]
                    y_index = self.mapping[filtered_sequence[i]]
                    X_rows.append(
                        sequence_to_tensor(
                            seq=x_indices, num_features=self.num_features
                        )
                    )
                    y_rows.append(y_index)

        if self.loader_type == DataLoaderType.TEST:
            return torch.vstack(X_rows), y_rows

        return torch.vstack(X_rows), torch.tensor(y_rows)
