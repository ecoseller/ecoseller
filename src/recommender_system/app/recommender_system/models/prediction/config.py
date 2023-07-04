from typing import List

from pydantic import BaseModel


class EASEConfig(BaseModel):
    l2_options: List[float] = [1, 10, 100]


class GRU4RecConfig(BaseModel):
    num_epochs_options: List[int] = [1]
    batch_size_options: List[int] = [64]
    embedding_size_options: List[int] = [100]
    hidden_size_options: List[int] = [100]
    learning_rate_options: List[float] = [0.0001]
