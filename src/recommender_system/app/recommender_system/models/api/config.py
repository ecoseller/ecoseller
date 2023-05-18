from datetime import datetime
from typing import Optional

from recommender_system.models.api.base import ApiBaseModel
from recommender_system.models.stored.model.config import ConfigModel


class Config(ApiBaseModel):
    """
    This model represents recommender system's configuration as an object that is sent from
    core to RS component via API.
    """

    create_at: Optional[datetime]
    retrieval_size: Optional[int]

    class Meta:
        stored_model_class = ConfigModel
