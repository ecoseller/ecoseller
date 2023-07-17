from recommender_system.models.api.base import ApiBaseModel


class ImmutableApiModel(ApiBaseModel):
    def save(self) -> None:
        stored_model = self.Meta.stored_model_class.from_api_model(self)
        stored_model.create()
