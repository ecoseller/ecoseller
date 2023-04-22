from flask import Flask
import pytest

from recommender_system.managers.prediction_pipeline import PredictionPipeline
from recommender_system.server.app import create_app
from tests.container import UnittestContainer


@pytest.fixture(scope="session", autouse=True)
def app() -> Flask:
    app = create_app()
    app.container = UnittestContainer()
    app.container.wire()
    return app


@pytest.fixture(scope="session", autouse=True)
def prediction_pipeline() -> PredictionPipeline:
    return PredictionPipeline()
