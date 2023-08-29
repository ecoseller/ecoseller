from datetime import datetime
from typing import Optional

from recommender_system.models.api.immutable import ImmutableApiModel
from recommender_system.models.stored.model.trainer_queue_item import (
    TrainerQueueItemModel,
)


class TrainerQueueItem(ImmutableApiModel):
    """
    This model represents trainer queue item as an object that is sent from core
    to RS component via API.
    """

    id: Optional[int]
    model_name: str
    create_at: Optional[datetime]
    processed: Optional[bool]

    class Meta:
        stored_model_class = TrainerQueueItemModel
