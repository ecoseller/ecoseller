from typing import Any, Dict, Type

from recommender_system.models.api.attribute import Attribute
from recommender_system.models.api.attribute_type import AttributeType
from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.api.product import Product
from recommender_system.models.api.product_translation import ProductTranslation
from recommender_system.models.api.product_type import ProductType
from recommender_system.models.api.product_variant import ProductVariant


class DataManager:
    def _model_class_from_name(self, model_class_name: str) -> Type[ApiBaseModel]:
        model_class: Type[ApiBaseModel]
        if model_class_name == "Attribute":
            model_class = Attribute
        elif model_class_name == "AttributeType":
            model_class = AttributeType
        elif model_class_name == "Product":
            model_class = Product
        elif model_class_name == "ProductTranslation":
            model_class = ProductTranslation
        elif model_class_name == "ProductType":
            model_class = ProductType
        elif model_class_name == "ProductVariant":
            model_class = ProductVariant
        elif model_class_name == "ProductAddToCart":
            raise NotImplementedError()
        elif model_class_name == "ProductDetailEnter":
            raise NotImplementedError()
        elif model_class_name == "ProductDetailLeave":
            raise NotImplementedError()
        elif model_class_name == "RecommendationView":
            raise NotImplementedError()
        elif model_class_name == "Review":
            raise NotImplementedError()
        else:
            raise ValueError(f"Unknown model class '{model_class_name}'.")
        return model_class

    def store_object(self, data: Dict[str, Any]) -> None:
        model_class = self._model_class_from_name(model_class_name=data["_model_class"])
        model = model_class.parse_obj(data)
        model.save()
