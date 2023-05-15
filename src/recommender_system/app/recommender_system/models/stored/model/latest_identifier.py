from recommender_system.models.stored.model.base import ModelStoredBaseModel


class LatestIdentifierModel(ModelStoredBaseModel):
    """
    This model represents the latest model identifier as an object that is stored in the database.
    """

    model_name: str
    identifier: str

    class Meta:
        primary_key = "model_name"
