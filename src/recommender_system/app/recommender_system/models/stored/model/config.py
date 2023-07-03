from datetime import datetime
from typing import Optional

from recommender_system.models.stored.model.immutable import ImmutableModelStoredModel
from recommender_system.models.prediction.config import EASEConfig
from recommender_system.models.prediction.config import GRU4RecConfig


class ConfigModel(ImmutableModelStoredModel):
    """
    This model represents recommender system's configuration as an object that is stored in the database.
    """

    id: Optional[int]
    create_at: datetime = datetime.now()
    retrieval_size: int = 1000

    ease_config: EASEConfig = EASEConfig()
    gru4rec_config: GRU4RecConfig = GRU4RecConfig()

    class Meta:
        primary_key = "id"

    @classmethod
    def get_current(cls) -> "ConfigModel":
        return cls()._storage.get_current_config()
