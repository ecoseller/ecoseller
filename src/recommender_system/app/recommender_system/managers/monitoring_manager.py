from datetime import datetime
from typing import Any, Dict, List, Tuple

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.stored.model.training_statistics import (
    TrainingStatisticsModel,
)
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.monitoring_statistics import (
    Statistics,
    ModelStatistics,
    TypeStatistics,
    StatisticsItem,
    TrainingDetails,
    ModelTrainingDetails,
)
from recommender_system.utils.recommendation_type import RecommendationType


class MonitoringManager:
    def _extract_hit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        global_hit = 0
        global_all = 0
        model = {}
        detailed = {}
        for model_name, model_data in data.items():
            model_hit = 0
            model_all = 0
            detailed[model_name] = {}
            for type_, type_data in model_data.items():
                hit = type_data["hit"]
                all_ = type_data["all"]
                try:
                    detailed[model_name][type_] = hit / all_
                except ZeroDivisionError:
                    detailed[model_name][type_] = None
                model_hit += hit
                model_all += all_

            try:
                model[model_name] = model_hit / model_all
            except ZeroDivisionError:
                model[model_name] = None
            global_hit += model_hit
            global_all += model_all

        try:
            global_ = global_hit / global_all
        except ZeroDivisionError:
            global_ = None

        return {
            "global": global_,
            "model": model,
            "detailed": detailed,
        }

    @inject
    def _extract_coverage(
        self,
        global_: List[Tuple[Any, ...]],
        model: List[Tuple[Any, ...]],
        detailed: List[Tuple[Any, ...]],
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> Dict[str, Any]:
        items_count = max(
            product_storage.count_objects(model_class=ProductVariantModel), 1
        )

        global_value = global_[0][0] / items_count

        model_value = {model_name: count / items_count for model_name, count in model}

        detailed_value = {}
        for model_name, recommendation_type, count in detailed:
            if model_name not in detailed_value:
                detailed_value[model_name] = {}
            detailed_value[model_name][recommendation_type] = count / items_count

        return {
            "global": global_value,
            "model": model_value,
            "detailed": detailed_value,
        }

    @inject
    def get_statistics(
        self,
        date_from: datetime,
        date_to: datetime,
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
        model_manager: ModelManager = Provide["model_manager"],
    ) -> Statistics:
        k = 10
        direct_hit_data = feedback_storage.count_direct_hit(
            date_from=date_from, date_to=date_to, k=k
        )
        direct_hit = self._extract_hit(data=direct_hit_data)
        future_hit_data = feedback_storage.count_future_hit(
            date_from=date_from, date_to=date_to
        )
        future_hit = self._extract_hit(data=future_hit_data)
        global_coverage_data = feedback_storage.count_coverage(
            date_from=date_from, date_to=date_to, per_model=False, per_type=False
        )
        model_coverage_data = feedback_storage.count_coverage(
            date_from=date_from, date_to=date_to, per_model=True, per_type=False
        )
        detailed_coverage_data = feedback_storage.count_coverage(
            date_from=date_from, date_to=date_to, per_model=True, per_type=True
        )
        coverage = self._extract_coverage(
            global_=global_coverage_data,
            model=model_coverage_data,
            detailed=detailed_coverage_data,
        )

        global_item = StatisticsItem(
            k=k,
            direct_hit=direct_hit["global"],
            future_hit=future_hit["global"],
            coverage=coverage["global"],
        )

        model_statistics = []
        for model_name in model_manager.get_all_model_names():
            types = []
            for recommendation_type in RecommendationType.values():
                types.append(
                    TypeStatistics(
                        recommendation_type=recommendation_type,
                        recommendation_type_title=RecommendationType.get_title(
                            value=recommendation_type
                        ),
                        item=StatisticsItem(
                            k=k,
                            direct_hit=direct_hit["detailed"]
                            .get(model_name, {})
                            .get(recommendation_type),
                            future_hit=future_hit["detailed"]
                            .get(model_name, {})
                            .get(recommendation_type),
                            coverage=coverage["detailed"]
                            .get(model_name, {})
                            .get(recommendation_type),
                        ),
                    )
                )
            model_statistics.append(
                ModelStatistics(
                    model_name=model_name,
                    item=StatisticsItem(
                        k=k,
                        direct_hit=direct_hit["model"].get(model_name),
                        future_hit=future_hit["model"].get(model_name),
                        coverage=coverage["model"].get(model_name),
                    ),
                    types=types,
                )
            )

        return Statistics(
            item=global_item,
            models=model_statistics,
        )

    @inject
    def get_training_details(
        self, model_manager: ModelManager = Provide["model_manager"]
    ) -> TrainingDetails:
        models_training_details = []
        for model in model_manager.get_all_models():
            try:
                statistics = TrainingStatisticsModel.get_latest(
                    model_name=model.Meta.model_name
                )
                models_training_details.append(
                    ModelTrainingDetails(
                        model_name=model.Meta.model_name, statistics=statistics
                    )
                )
            except TrainingStatisticsModel.DoesNotExist:
                pass

        return TrainingDetails(models=models_training_details)
