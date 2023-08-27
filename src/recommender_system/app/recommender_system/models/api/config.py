from datetime import datetime
from typing import List, Optional, Dict

from pydantic import Field

from recommender_system.models.api.immutable import ImmutableApiModel
from recommender_system.models.prediction.config import EASEConfig, GRU4RecConfig
from recommender_system.models.stored.model.config import ConfigModel


class Config(ImmutableApiModel):
    """
    This model represents recommender system's configuration as an object that is sent from
    core to RS component via API.
    """

    create_at: Optional[datetime] = datetime.now()
    retrieval_size: int = Field(default=1000, alias="retrievalSize")
    ordering_size: int = Field(default=50, alias="orderingSize")

    models_disabled: Dict[str, bool] = Field(default={})

    homepage_retrieval_cascade: Optional[List[str]] = Field(
        alias="homepageRetrievalCascade"
    )
    homepage_scoring_cascade: Optional[List[str]] = Field(
        alias="homepageScoringCascade"
    )

    category_list_scoring_cascade: Optional[List[str]] = Field(
        alias="categoryListScoringCascade"
    )

    product_detail_retrieval_cascade: Optional[List[str]] = Field(
        alias="productDetailRetrievalCascade"
    )
    product_detail_scoring_cascade: Optional[List[str]] = Field(
        alias="productDetailScoringCascade"
    )

    cart_retrieval_cascade: Optional[List[str]] = Field(alias="cartRetrievalCascade")
    cart_scoring_cascade: Optional[List[str]] = Field(alias="cartScoringCascade")

    ease_config: EASEConfig = Field(alias="easeConfig")
    gru4rec_config: GRU4RecConfig = Field(alias="gru4recConfig")

    class Meta:
        stored_model_class = ConfigModel
