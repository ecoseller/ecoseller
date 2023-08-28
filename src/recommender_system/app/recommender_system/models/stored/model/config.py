from datetime import datetime
from typing import List, Optional, TYPE_CHECKING, Dict, Any

from dependency_injector.wiring import inject, Provide
from pydantic import Field

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel
from recommender_system.models.prediction.config import EASEConfig, GRU4RecConfig

if TYPE_CHECKING:
    from recommender_system.managers.model_manager import ModelManager


@inject
def get_model_names(
    levels: Optional[List[int]] = None,
    model_manager: "ModelManager" = Provide["model_manager"],
) -> List[str]:
    model_names = model_manager.get_all_model_names()

    if levels is None:
        return model_names[::-1]

    return [model_names[level] for level in levels]


class ConfigModel(ImmutableModelStoredModel):
    """
    This model represents recommender system's configuration as an object that is stored in the database.
    """

    id: Optional[int]
    create_at: datetime = datetime.now()
    retrieval_size: int = Field(
        default=1000,
        alias="retrievalSize",
        title="Retrieval size",
        description="Retrieval size description",
    )
    ordering_size: int = Field(
        default=50,
        alias="orderingSize",
        title="Ordering size",
        description="Ordering size description",
    )

    models_disabled: Dict[str, bool] = Field(default={})

    homepage_retrieval_cascade: Optional[List[str]] = Field(
        alias="homepageRetrievalCascade",
        title="Homepage retrieval",
        description="Homepage retrieval description",
    )
    homepage_scoring_cascade: Optional[List[str]] = Field(
        alias="homepageScoringCascade",
        title="Homepage scoring",
        description="Homepage scoring description",
    )

    category_list_retrieval_cascade: Optional[List[str]] = Field(
        default=None,
        alias="categoryListRetrievalCascade",
        title="Category list retrieval",
        description="Category list retrieval description",
    )
    category_list_scoring_cascade: Optional[List[str]] = Field(
        alias="categoryListScoringCascade",
        title="Category list scoring",
        description="Category list scoring description",
    )

    product_detail_retrieval_cascade: Optional[List[str]] = Field(
        alias="productDetailRetrievalCascade",
        title="Product detail retrieval",
        description="Product detail retrieval description",
    )
    product_detail_scoring_cascade: Optional[List[str]] = Field(
        alias="productDetailScoringCascade",
        title="Product detail scoring",
        description="Product detail scoring description",
    )

    cart_retrieval_cascade: Optional[List[str]] = Field(
        alias="cartRetrievalCascade",
        title="Cart retrieval",
        description="Cart retrieval description",
    )
    cart_scoring_cascade: Optional[List[str]] = Field(
        alias="cartScoringCascade",
        title="Cart scoring",
        description="Cart scoring description",
    )

    ease_config: EASEConfig = Field(default=EASEConfig(), alias="easeConfig")
    gru4rec_config: GRU4RecConfig = Field(
        default=GRU4RecConfig(), alias="gru4recConfig"
    )

    def __init__(self, *args, **kwargs):
        super(ConfigModel, self).__init__(*args, **kwargs)

        if self.homepage_retrieval_cascade is None:
            self.homepage_retrieval_cascade = get_model_names(levels=[4, 1, 0])
        if self.homepage_scoring_cascade is None:
            self.homepage_scoring_cascade = get_model_names(levels=[4, 3, 1, 0])

        if self.category_list_scoring_cascade is None:
            self.category_list_scoring_cascade = get_model_names(levels=[4, 3, 1, 0])

        if self.product_detail_retrieval_cascade is None:
            self.product_detail_retrieval_cascade = get_model_names(levels=[2, 1, 0])
        if self.product_detail_scoring_cascade is None:
            self.product_detail_scoring_cascade = get_model_names()

        if self.cart_retrieval_cascade is None:
            self.cart_retrieval_cascade = get_model_names(levels=[2, 1, 0])
        if self.cart_scoring_cascade is None:
            self.cart_scoring_cascade = get_model_names()

    class Meta:
        primary_key = "id"

    @classmethod
    def get_current(cls) -> "ConfigModel":
        return cls()._storage.get_current_config()

    def is_disabled(self, model: str) -> bool:
        return self.models_disabled.get(model, False)

    @inject
    def dict(
        self,
        exclude_models: bool = True,
        model_manager: "ModelManager" = Provide["model_manager"],
        *args: Any,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        kwargs.setdefault("exclude", "category_list_retrieval_cascade")
        return super().dict(*args, **kwargs)

    @property
    def info(self) -> Dict[str, Any]:
        result = {
            field.alias: {
                "title": field.field_info.title,
                "description": field.field_info.description,
            }
            for field in self.__fields__.values()
        }
        result["easeConfig"] = self.ease_config.info
        result["gru4recConfig"] = self.gru4rec_config.info
        return result
