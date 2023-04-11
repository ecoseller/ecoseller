from flask import Flask
import pytest

from recommender_system.server.app import create_app
from tests.container import UnittestContainer


@pytest.fixture(scope="session", autouse=True)
def app() -> Flask:
    app = create_app()
    app.container = UnittestContainer()
    app.container.wire()
    return app
