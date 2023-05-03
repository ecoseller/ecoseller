import requests
from typing import Any, Dict

from django.conf import settings


class RecommenderSystemApi:
    server_url: str = settings.RS_URL
    enabled: bool = settings.RS_ENABLED

    @classmethod
    def store_object(cls, data: Dict[str, Any]) -> None:
        if cls.enabled:
            _ = requests.request(
                method="POST", url=cls.server_url + "/store_object", json=data
            )
