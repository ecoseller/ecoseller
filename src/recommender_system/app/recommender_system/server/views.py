from typing import Any, Tuple

from dependency_injector.wiring import inject, Provide
from flask import request

from recommender_system.managers.data_manager import DataManager


@inject
def view_store_object(
    data_manager: DataManager = Provide["data_manager"],
) -> Tuple[Any, ...]:
    data_manager.store_object(data=request.json)
    return "", 200
