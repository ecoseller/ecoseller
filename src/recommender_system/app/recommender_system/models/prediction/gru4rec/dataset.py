from typing import Dict, List, Tuple

from dependency_injector.wiring import inject, Provide
import torch
from torch.utils.data import Dataset

from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage


def sequence_to_tensor(seq: List[int], num_features: int) -> torch.Tensor:
    row = torch.zeros(num_features)

    if len(seq) == 0:
        return row

    for item in seq:
        torch.mul(row, 0.9)
        row[item] = 1

    return torch.div(row, torch.sum(row))


class SessionDataset(Dataset):
    X: torch.Tensor
    y: torch.Tensor
    num_features: int

    @inject
    def __init__(
        self,
        mapping: Dict[str, int],
        device: torch.device,
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
    ):
        self.num_features = len(mapping.keys())
        session_sequences = feedback_storage.get_session_sequences()

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

        self.X = torch.vstack(X_rows).to(device)
        self.y = torch.tensor(y_rows).to(device)

    def __len__(self) -> int:
        return self.X.size(dim=0)

    def __getitem__(self, item) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.X[item], self.y[item]
