from typing import List, Optional

from pydantic import BaseModel


class MonitoringStatisticsItem(BaseModel):
    direct_hit: Optional[float]
    future_hit: Optional[float]
    coverage: Optional[float]


class MonitoringTypeStatistics(BaseModel):
    recommendation_type: str
    item: MonitoringStatisticsItem


class MonitoringModelStatistics(BaseModel):
    model_name: str
    item: MonitoringStatisticsItem
    types: List[MonitoringTypeStatistics]


class MonitoringStatistics(BaseModel):
    k: int
    item: MonitoringStatisticsItem
    models: List[MonitoringModelStatistics]
