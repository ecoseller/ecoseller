from unittest import TestCase

from dependency_injector.wiring import inject, Provide
import pytest

from recommender_system.managers.model_manager import ModelManager
from recommender_system.models.stored.model.config import ConfigModel
from tests.storage.tools import get_or_create_model, delete_model, default_dicts


@pytest.fixture
def clear_config():
    config_pk = 0

    delete_model(model_class=ConfigModel, pk=config_pk)

    yield config_pk

    delete_model(model_class=ConfigModel, pk=config_pk)


@pytest.fixture
def create_config():
    config = get_or_create_model(model_class=ConfigModel)

    yield config.pk

    delete_model(model_class=ConfigModel, pk=config.pk)


@inject
def test_config_create(
    clear_config, model_manager: ModelManager = Provide["model_manager"]
):
    config_pk = clear_config
    config_dict = default_dicts[ConfigModel]

    with pytest.raises(ConfigModel.DoesNotExist):
        _ = ConfigModel.get(pk=config_pk)

    assert model_manager.config.id is None

    config = ConfigModel.parse_obj(config_dict)
    config.create()

    stored_config = ConfigModel.get(pk=config_pk)

    TestCase().assertDictEqual(stored_config.dict(), config.dict())

    assert model_manager.config.id == config_pk


def test_config_update(create_config):
    config_pk = create_config
    config = ConfigModel.get(pk=config_pk)

    config.retrieval_size = 0
    with pytest.raises(TypeError):
        config.save()


def test_config_refresh(create_config):
    config_pk = create_config
    config = ConfigModel.get(pk=config_pk)

    with pytest.raises(TypeError):
        config.save()


def test_config_delete(create_config):
    config_pk = create_config
    config = ConfigModel.get(pk=config_pk)

    with pytest.raises(TypeError):
        config.delete()
