from datetime import datetime
from typing import List, Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.prediction.config import EASEConfig, GRU4RecConfig
from recommender_system.models.stored.model.config import ConfigModel


class Config(ApiBaseModel):
    """
    This model represents recommender system's configuration as an object that is sent from
    core to RS component via API.
    """

    create_at: Optional[datetime]
    retrieval_size: int
    ordering_size: int

    homepage_retrieval_cascade: List[str]
    homepage_scoring_cascade: List[str]

    category_list_scoring_cascade: List[str]

    product_detail_retrieval_cascade: List[str]
    product_detail_scoring_cascade: List[str]

    cart_retrieval_cascade: List[str]
    cart_scoring_cascade: List[str]

    ease_config: EASEConfig
    gru4rec_config: GRU4RecConfig

    class Meta:
        stored_model_class = ConfigModel
