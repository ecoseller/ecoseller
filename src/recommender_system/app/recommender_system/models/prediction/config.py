from typing import List

from pydantic import Field

from recommender_system.utils.base_model import BaseModel


class EASEConfig(BaseModel):
    l2_options: List[float] = Field(default=[1, 10, 100], alias="l2Options")
    reviews_multiplier: float = Field(default=0.5, alias="reviewsMultiplier")


class GRU4RecConfig(BaseModel):
    num_epochs_options: List[int] = Field(default=[1], alias="numEpochsOptions")
    batch_size_options: List[int] = Field(default=[64], alias="batchSizeOptions")
    embedding_size_options: List[int] = Field(
        default=[100], alias="embeddingSizeOptions"
    )
    hidden_size_options: List[int] = Field(default=[100], alias="hiddenSizeOptions")
    learning_rate_options: List[float] = Field(
        default=[0.0001], alias="learningRateOptions"
    )
    incremental_trainings: int = Field(default=10, alias="incrementalTrainings")
    events_multiplier: float = Field(default=10, alias="eventsMultiplier")
