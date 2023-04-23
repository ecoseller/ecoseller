from typing import Type, TYPE_CHECKING

from pydantic import BaseModel

if TYPE_CHECKING:
    from recommender_system.models.stored.base import StoredBaseModel


class ApiBaseModel(BaseModel):
    class Meta:
        stored_model_class: Type["StoredBaseModel"]

    def dict(self, *args, **kwargs):
        if "exclude_none" not in kwargs:
            kwargs["exclude_none"] = True
        return super().dict(*args, **kwargs)

    def save(self) -> None:
        stored_model = self.Meta.stored_model_class.from_api_model(self)
        stored_model.save()
