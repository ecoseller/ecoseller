from typing import List, Dict, Any

from pydantic import Field

from recommender_system.utils.base_model import BaseModel


class EASEConfig(BaseModel):
    l2_options: List[float] = Field(
        default=[1, 10, 100],
        alias="l2Options",
        title="L2 regularization options",
        description="""All options of the L2 regularization parameter that are tried to obtain the best results.""",
    )
    reviews_multiplier: float = Field(
        default=0.5,
        alias="reviewsMultiplier",
        title="Reviews multiplier",
        description="""At least how many reviews must exist to let this model be trained, as a multiplier of the product
        variants in the database. E.g. at least 100 reviews for 200 product variants with a value of 0.5.""",
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
        description="""All options of the number of epochs that are tried to obtain the best results.""",
    )
    batch_size_options: List[int] = Field(
        default=[64],
        alias="batchSizeOptions",
        title="Batch size options",
        description="""All options of the batch size that are tried to obtain the best results.""",
    )
    embedding_size_options: List[int] = Field(
        default=[100],
        alias="embeddingSizeOptions",
        title="Number of epochs options",
        description="""All options of the embedding layer size that are tried to obtain the best results.""",
    )
    hidden_size_options: List[int] = Field(
        default=[100],
        alias="hiddenSizeOptions",
        title="Hidden layer size options",
        description="""All options of the hidden layer size that are tried to obtain the best results.""",
    )
    learning_rate_options: List[float] = Field(
        default=[0.0001],
        alias="learningRateOptions",
        title="Learning rate options",
        description="""All options of the learning rate that are tried to obtain the best results.""",
    )
    incremental_trainings: int = Field(
        default=10,
        alias="incrementalTrainings",
        title="Number of incremental trainings",
        description="""Number of incremental trainings between two full trainings. The incremental training only selects
        new enters of the product details and runs one epoch with the currently used parameters.""",
    )
    events_multiplier: float = Field(
        default=10,
        alias="eventsMultiplier",
        title="Events multiplier",
        description="""At least how many visits of product detail must exist to let this model be trained, as a
        multiplier of the product variants in the database. E.g. at least 1000 reviews for 100 product variants with a
        value 10.""",
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
