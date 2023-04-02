from datetime import datetime
from typing import Any, Dict, Type

from recommender_system.models.stored.attribute import AttributeModel
from recommender_system.models.stored.attribute_type import AttributeTypeModel
from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product import ProductModel
from recommender_system.models.stored.product_type import ProductTypeModel
from recommender_system.storage import ModelNotFoundException


default_dicts: Dict[Type[StoredBaseModel], Any] = {
    AttributeTypeModel: {
        "id": 0,
        "type_name": "weight",
        "unit": "kg",
    },
    AttributeModel: {
        "id": 0,
        "value": "1",
        "attribute_type_id": 0,
        "parent_attribute_id": None,
    },
    ProductTypeModel: {
        "id": 0,
        "name": "1",
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
    ProductModel: {
        "id": 0,
        "published": True,
        "category_id": 0,
        "update_at": datetime.now(),
        "create_at": datetime.now(),
    },
}


def create_model(model_class: Type[StoredBaseModel]) -> StoredBaseModel:
    model = model_class.parse_obj(default_dicts[model_class])
    model.create()
    return model


def delete_model(model_class: Type[StoredBaseModel], pk: Any) -> None:
    try:
        model = model_class.get(pk=pk)
        model.delete()
    except ModelNotFoundException:
        pass
