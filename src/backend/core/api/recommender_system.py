import requests
from typing import Any, Dict, List, Optional

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
    def store_objects(cls, data: List[Dict[str, Any]]) -> None:
        if cls.enabled:
            _ = requests.request(
                method="POST", url=cls.server_url + "/store_objects", json=data
            )

    @classmethod
    def update_config(cls, data: Dict[str, Any]) -> None:
        data["_model_class"] = "Config"
        cls.store_object(data=data)

    @classmethod
    def get_dashboard(
        cls, date_from: str, date_to: str, page: str
    ) -> Optional[Dict[str, Any]]:
        if cls.enabled:
            response = requests.request(
                method="GET",
                url=cls.server_url + "/dashboard/" + page,
                params={"date_from": date_from, "date_to": date_to},
            )
            return response.json()
        return None

    @classmethod
    def get_recommendations(
        cls, data: Dict[str, Any]
    ) -> Optional[List[Dict[str, Any]]]:
        if cls.enabled:
            response = requests.request(
                method="POST",
                url=cls.server_url + "/predict",
                json=data,
            )
            if response.status_code == 200:
                return response.json()
        return None

    @classmethod
    def get_category_product_positions(
        cls, category_id: int, session_id: str, user_id: Optional[int]
    ) -> Optional[Dict[str, int]]:
        if cls.enabled:
            response = requests.request(
                method="POST",
                url=cls.server_url + "/predict/product_positions",
                json={
                    "recommendation_type": "CATEGORY_LIST",
                    "category_id": category_id,
                    "session_id": session_id,
                    "user_id": user_id,
                },
            )
            if response.status_code == 200:
                return response.json()
        return None
