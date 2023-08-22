from typing import List, Dict, Any

from pydantic import Field

from recommender_system.utils.base_model import BaseModel


class EASEConfig(BaseModel):
    l2_options: List[float] = Field(
        default=[1, 10, 100],
        alias="l2Options",
        title="L2 regularization options",
        description="L2 regularization options description",
    )
    reviews_multiplier: float = Field(
        default=0.5,
        alias="reviewsMultiplier",
        title="Reviews multiplier",
        description="Reviews multiplier description",
    )

    @property
    def info(self) -> Dict[str, Any]:
        return {
            field.alias: {
                "title": field.field_info.title,
                "description": field.field_info.description,
            }
            for field in self.__fields__.values()
        }


class GRU4RecConfig(BaseModel):
    num_epochs_options: List[int] = Field(
        default=[1],
        alias="numEpochsOptions",
        title="Number of epochs options",
        description="Number of epochs options description",
    )
    batch_size_options: List[int] = Field(
        default=[64],
        alias="batchSizeOptions",
        title="Batch size options",
        description="Batch size options description",
    )
    embedding_size_options: List[int] = Field(
        default=[100],
        alias="embeddingSizeOptions",
        title="Number of epochs options",
        description="Number of epochs options description",
    )
    hidden_size_options: List[int] = Field(
        default=[100],
        alias="hiddenSizeOptions",
        title="Hidden layer size options",
        description="Hidden layer size options description",
    )
    learning_rate_options: List[float] = Field(
        default=[0.0001],
        alias="learningRateOptions",
        title="Learning rate options",
        description="Learning rate options description",
    )
    incremental_trainings: int = Field(
        default=10,
        alias="incrementalTrainings",
        title="Number of incremental trainings",
        description="Number of incremental trainings description",
    )
    events_multiplier: float = Field(
        default=10,
        alias="eventsMultiplier",
        title="Events multiplier",
        description="Events multiplier description",
    )

    @property
    def info(self) -> Dict[str, Any]:
        return {
            field.alias: {
                "title": field.field_info.title,
                "description": field.field_info.description,
            }
            for field in self.__fields__.values()
        }
