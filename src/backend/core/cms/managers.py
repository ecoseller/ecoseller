from parler.managers import TranslatableManager, TranslatableQuerySet
from polymorphic.managers import PolymorphicManager
from polymorphic.query import PolymorphicQuerySet

""""
This is for Polymorphic translatable models
"""


class PageQuerySet(TranslatableQuerySet, PolymorphicQuerySet):
    pass


class PageManager(PolymorphicManager, TranslatableManager):
    queryset_class = PageQuerySet
