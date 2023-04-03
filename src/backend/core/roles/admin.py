from django.contrib import admin
from .models import (
    ManagerPermission,
    ManagerGroup,
)

# Register your models here.


@admin.register(ManagerPermission)
class ManagerPermissionAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "model",
        "description",
        "type",
    )
    list_filter = (
        "name",
        "model",
        "description",
        "type",
    )
    search_fields = (
        "name",
        "model",
        "description",
        "type",
    )


@admin.register(ManagerGroup)
class ManagerGroupAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "description",
    )
    list_filter = (
        "name",
        "description",
    )
    search_fields = (
        "name",
        "description",
    )
    filter_horizontal = ("permissions",)
