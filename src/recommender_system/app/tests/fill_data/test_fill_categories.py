import csv

import pytest

from recommender_system.models.stored.product.category_ancestor import (
    CategoryAncestorModel,
)
from recommender_system.scripts.fill_data import fill_ancestors
from tests.storage.tools import delete_model


FILENAME = "tests/fill_data/categories.csv"
with open(FILENAME, "r") as file:
    ROWS = list(csv.reader(file, delimiter=","))[1:]


@pytest.fixture
def clear_categories():
    edges = set()
    nodes = set()
    for row in ROWS:
        nodes.add(row[0])
        if row[1] != "":
            nodes.add(row[1])
            edges.add((row[0], row[1]))

    all_ancestors = {}
    for node in nodes:
        all_ancestors[node] = set()
        current = node
        while current is not None:
            parent = None
            for row in ROWS:
                if current == row[0]:
                    parent = row[1] if row[1] != "" else None
                    break
            if parent is not None:
                all_ancestors[node].add(parent)
            current = parent

    category_ancestors = set()
    for category_id, ancestor_ids in all_ancestors.items():
        for ancestor_id in ancestor_ids:
            category_ancestors.add((category_id, ancestor_id))

    for category_id, category_ancestor_id in category_ancestors:
        delete_model(
            model_class=CategoryAncestorModel,
            category_id=category_id,
            category_ancestor_id=category_ancestor_id,
        )

    yield category_ancestors

    for category_id, category_ancestor_id in category_ancestors:
        delete_model(
            model_class=CategoryAncestorModel,
            category_id=category_id,
            category_ancestor_id=category_ancestor_id,
        )


def test_fill_categories(clear_categories):
    category_ancestors = clear_categories

    for category_id, category_ancestor_id in category_ancestors:
        with pytest.raises(CategoryAncestorModel.DoesNotExist):
            _ = CategoryAncestorModel.get(
                category_id=category_id, category_ancestor_id=category_ancestor_id
            )

    old_count = len(CategoryAncestorModel.gets())

    fill_ancestors(rows=ROWS)

    new_count = len(CategoryAncestorModel.gets())

    assert new_count == old_count + len(category_ancestors)
