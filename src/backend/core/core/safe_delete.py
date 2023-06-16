from django.db import models
from polymorphic.models import PolymorphicModel, PolymorphicManager


class SafeDeleteManager(models.Manager):
    """
    Custom manager that filters out safe deleted objects.
    """

    def get_queryset(self):
        return super().get_queryset().exclude(safe_deleted=True)


class SafeDeletePolymorphicManager(PolymorphicManager, SafeDeleteManager):
    pass


class SafeDeleteModel(models.Model):
    """
    Abstract model with a safe delete method and custom manager that
    filters out safe deleted objects.
    """

    objects = SafeDeleteManager()
    safe_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.safe_deleted = True
        self.save()

    def hard_delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    def undelete(self, *args, **kwargs):
        self.safe_deleted = False
        self.save()
