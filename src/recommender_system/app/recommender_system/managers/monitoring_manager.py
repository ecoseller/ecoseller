from datetime import datetime
from typing import Optional

from dependency_injector.wiring import inject, Provide

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.stored.product.product_variant import ProductVariantModel
from recommender_system.storage.feedback.abstract import AbstractFeedbackStorage
from recommender_system.storage.product.abstract import AbstractProductStorage
from recommender_system.utils.monitoring_statistics import (
    Performance,
    PerformanceData,
    PerformanceDataData,
    PerformanceDuration,
    Training,
    TrainingData,
    TrainingDataData,
    TrainingMemory,
    TrainingStatistics,
)


class MonitoringManager:
    @inject
    def _extract_coverage(
        self,
        covered: int,
        product_storage: AbstractProductStorage = Provide["product_storage"],
    ) -> Optional[float]:
        items_count = max(
            product_storage.count_objects(model_class=ProductVariantModel), 1
        )

        try:
            return covered / items_count
        except ZeroDivisionError:
            return None

    @inject
    def _extract_performance_data(
        self,
        date_from: datetime,
        date_to: datetime,
        model_name: Optional[str],
        feedback_storage: AbstractFeedbackStorage = Provide["feedback_storage"],
    ) -> PerformanceData:
        k = 10

        direct_hit_data = feedback_storage.count_direct_hit(
            date_from=date_from, date_to=date_to, k=k, model_name=model_name
        )
        try:
            direct_hit = direct_hit_data["hit"] / direct_hit_data["all"]
        except ZeroDivisionError:
            direct_hit = None

        future_hit_data = feedback_storage.count_future_hit(
            date_from=date_from, date_to=date_to, k=k, model_name=model_name
        )
        try:
            future_hit = future_hit_data["hit"] / future_hit_data["all"]
        except ZeroDivisionError:
            future_hit = None

        coverage_data = feedback_storage.count_coverage(
            date_from=date_from, date_to=date_to, model_name=model_name
        )
        coverage = self._extract_coverage(covered=coverage_data)

        predictions = feedback_storage.count_predictions(
            date_from=date_from, date_to=date_to, model_name=model_name
        )

        retrieval_duration_data = feedback_storage.get_retrieval_duration(
            date_from=date_from, date_to=date_to, model_name=model_name
        )

        scoring_duration_data = feedback_storage.get_scoring_duration(
            date_from=date_from, date_to=date_to, model_name=model_name
        )

        return PerformanceData(
            k=k,
            data=PerformanceDataData(
                hit_rate=direct_hit,
                future_hit_rate=future_hit,
                coverage=coverage,
                predictions=predictions,
                retrieval_duration=PerformanceDuration(
                    avg=retrieval_duration_data["avg"],
                    max=retrieval_duration_data["max"],
                ),
                scoring_duration=PerformanceDuration(
                    avg=scoring_duration_data["avg"],
                    max=retrieval_duration_data["max"],
                ),
            ),
        )

    @inject
    def get_performance(
        self,
        date_from: datetime,
        date_to: datetime,
        model_manager: ModelManager = Provide["model_manager"],
    ) -> Performance:
        general = self._extract_performance_data(
            date_from=date_from, date_to=date_to, model_name=None
        )
        model_specific = {
            model_name: self._extract_performance_data(
                date_from=date_from, date_to=date_to, model_name=model_name
            )
            for model_name in model_manager.get_all_model_names()
        }
        return Performance(general=general, model_specific=model_specific)

    def _extract_training_data(
        self,
        date_from: datetime,
        date_to: datetime,
        model_name: Optional[str],
    ) -> TrainingData:
        training_statistics_data = {
            "started": 1,
            "completed": 2,
            "failed": 3,
        }
        peak_memory_data = {"avg": 10, "max": 100}
        peak_memory_percentage_data = {"avg": 3, "max": 30}

        return TrainingData(
            data=TrainingDataData(
                trainings=TrainingStatistics(
                    started=training_statistics_data["started"],
                    completed=training_statistics_data["completed"],
                    failed=training_statistics_data["failed"],
                ),
                peak_memory=TrainingMemory(
                    avg=peak_memory_data["avg"],
                    max=peak_memory_data["max"],
                ),
                peak_memory_percentage=TrainingMemory(
                    avg=peak_memory_percentage_data["avg"],
                    max=peak_memory_percentage_data["max"],
                ),
            )
        )

    @inject
    def get_training_details(
        self,
        date_from: datetime,
        date_to: datetime,
        model_manager: ModelManager = Provide["model_manager"],
    ) -> Training:
        general = self._extract_training_data(
            date_from=date_from, date_to=date_to, model_name=None
        )
        model_specific = {
            model_name: self._extract_training_data(
                date_from=date_from, date_to=date_to, model_name=model_name
            )
            for model_name in model_manager.get_all_model_names()
        }
        return Training(general=general, model_specific=model_specific)
