from datetime import datetime
from typing import Any, List, Optional, TYPE_CHECKING

from dependency_injector.wiring import inject, Provide

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.base import StoredBaseModel
from recommender_system.models.stored.product.base import ProductStoredBaseModel
from recommender_system.models.stored.product.product_type import ProductTypeModel
from recommender_system.storage.product.abstract import AbstractProductStorage

if TYPE_CHECKING:
    from recommender_system.models.stored.product.product_translation import (
        ProductTranslationModel,
    )
    from recommender_system.models.stored.product.product_variant import (
        ProductVariantModel,
    )


class ProductModel(ProductStoredBaseModel):
    """
    This model represents product as an object that is stored in the database.
    """

    id: int
    published: bool
    category_id: Optional[int]
    update_at: datetime
    create_at: datetime

    product_type_id: Optional[int]

    class Meta:
        primary_key = "id"

    @classmethod
    def from_api_model(cls, model: ApiBaseModel, **kwargs: Any) -> StoredBaseModel:
        stored = super().from_api_model(
            model=model, product_type_id=model.type_id, **kwargs
        )
        return stored

    @property
    def product_type(self) -> Optional[ProductTypeModel]:
        if self.product_type_id is None:
            return None
        return self._storage.get_object(
            model_class=ProductTypeModel, pk=self.product_type_id
        )

    @property
    def translations(self) -> List["ProductTranslationModel"]:
        from recommender_system.models.stored.product.product_translation import (
            ProductTranslationModel,
        )

        return self._storage.get_objects(
            model_class=ProductTranslationModel, product_id=self.id
        )

    @property
    def type(self) -> Optional[ProductTypeModel]:
        if self.product_type_id is None:
            return None
        return self._storage.get_object(
            model_class=ProductTypeModel, pk=self.product_type_id
        )

    @property
    def product_variants(self) -> List["ProductVariantModel"]:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        return self._storage.get_related_objects(
            model=self, relation_model_class=ProductProductVariantModel
        )

    def delete(self) -> None:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        for ppv in ProductProductVariantModel.gets(product_id=self.id):
            ppv.delete()
        super().delete()

    def add_product_variant(self, product_variant: "ProductVariantModel") -> None:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        ProductProductVariantModel(
            product_id=self.id, product_variant_sku=product_variant.sku
        ).create()

    @inject
    def update_product_variants(
        self,
        product_variants: List[str],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> None:
        from recommender_system.models.stored.product.product_product_variant import (
            ProductProductVariantModel,
        )

        for ppv in ProductProductVariantModel.gets(product_id=self.id):
            ppv.delete()

        ppvs = [
            ProductProductVariantModel(
                product_variant_sku=product_variant, product_id=self.id
            )
            for product_variant in product_variants
        ]

        product_storage.bulk_create_objects(models=ppvs)
