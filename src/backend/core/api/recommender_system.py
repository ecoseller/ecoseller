import requests
from typing import Any, Dict, Optional

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

    @classmethod
    def get_dashboard(cls, date_from: str, date_to: str) -> Optional[Dict[str, Any]]:
        if cls.enabled:
            response = requests.request(
                method="GET",
                url=cls.server_url + "/dashboard",
                params={"date_from": date_from, "date_to": date_to},
            )
            return response.json()
        return None
