from django.db import models

# Create your models here.


class ManagerPermission(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    model = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    type = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class ManagerGroup(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    description = models.CharField(max_length=200)
    permissions = models.ManyToManyField(ManagerPermission)

    def __str__(self):
        return self.name
