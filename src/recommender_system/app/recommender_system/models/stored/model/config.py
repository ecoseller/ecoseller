from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

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
    retrieval_size: int = Field(default=1000, alias="retrievalSize")
    ordering_size: int = Field(default=50, alias="orderingSize")

    homepage_retrieval_cascade: List[str] = Field(alias="homepageRetrievalCascade")
    homepage_scoring_cascade: List[str] = Field(alias="homepageScoringCascade")

    category_list_scoring_cascade: List[str] = Field(alias="categoryListScoringCascade")

    product_detail_retrieval_cascade: List[str] = Field(
        alias="productDetailRetrievalCascade"
    )
    product_detail_scoring_cascade: List[str] = Field(
        alias="productDetailScoringCascade"
    )

    cart_retrieval_cascade: List[str] = Field(alias="cartRetrievalCascade")
    cart_scoring_cascade: List[str] = Field(alias="cartScoringCascade")

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
