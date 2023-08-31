from typing import Any, List, Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.storage.cache.abstract import AbstractCacheStorage
from recommender_system.utils.recommendation_type import RecommendationType


class CacheManager:
    @inject
    def get(
        self,
        recommendation_type: RecommendationType,
        session_id: str,
        category_id: Optional[int] = None,
        cache_storage: AbstractCacheStorage = Provide["cache_storage"],
        **kwargs: Any
    ) -> Optional[List[str]]:
        if (
            recommendation_type == RecommendationType.CATEGORY_LIST
            and category_id is not None
        ):
            return cache_storage.get_category_list(
                session_id=session_id, category_id=category_id
            )
        return None

    @inject
    def save(
        self,
        recommendation_type: RecommendationType,
        session_id: str,
        predictions: List[str],
        category_id: Optional[int] = None,
        cache_storage: AbstractCacheStorage = Provide["cache_storage"],
        **kwargs: Any
    ) -> None:
        if (
            recommendation_type == RecommendationType.CATEGORY_LIST
            and category_id is not None
        ):
            cache_storage.store_category_list(
                session_id=session_id,
                category_id=category_id,
                category_list=predictions,
            )
