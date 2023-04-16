# Managing roles - groups and permissions
import json
from enum import Enum
from django.contrib.auth.models import Permission, Group
from .models import ManagerPermission, ManagerGroup


class PermissionType(Enum):
    VIEW = 1
    ADD = 2
    CHANGE = 3
    DELETE = 4

    def __str__(self):
        return self.name.lower()

    @staticmethod
    def django_permission_name_to_type(name):
        for permType in PermissionType:
            if permType.__str__() in name:
                return permType
        return None


# Managing class for roles - groups and permissions
class RolesManager:
    @staticmethod
    def load_roles_from_config(config):
        f = open(config, "r")
        data = json.load(f)
        for role in data:
            for _, roleAttributeValue in role.items():
                group, _ = ManagerGroup.objects.get_or_create(
                    name=roleAttributeValue["name"],
                    description=roleAttributeValue["description"],
                )
                for permission in roleAttributeValue["permissions"]:
                    perm, _ = ManagerPermission.objects.get_or_create(
                        name=permission["name"],
                        model=permission["model"],
                        description=permission["description"],
                        type=PermissionType[permission["type"]].__str__(),
                    )
                    group.permissions.add(perm)

    @staticmethod
    def django_permission_to_manager_permission(djangoPermission):
        permType = PermissionType.django_permission_name_to_type(djangoPermission.name)
        for perm in ManagerPermission.objects.all():
            if (
                perm.model.lower() == djangoPermission.content_type.model.lower()
                and PermissionType[perm.type.upper()] == permType
            ):
                return perm

        return None

    @staticmethod
    def manager_permission_to_django_permission(managerPermission):
        permissions = Permission.objects.all()
        for perm in permissions:
            if (
                perm.content_type.model.lower() == managerPermission.model.lower()
                and PermissionType.django_permission_name_to_type(perm.name)
                == PermissionType[managerPermission.type.upper()]
            ):
                return perm
        return None

    @staticmethod
    def django_group_to_manager_group(djangoGroup):
        try:
            group = ManagerGroup.objects.get(name=djangoGroup.name)
        except ManagerGroup.DoesNotExist:
            return None

        return group

    @staticmethod
    def manager_group_to_django_group(managerGroupName):
        try:
            group = Group.objects.get(name=managerGroupName)
        except Group.DoesNotExist:
            return None

        return group

    @staticmethod
    def django_permission_to_manager_permission_name(djangoPermission):
        permType = PermissionType.django_permission_name_to_type(djangoPermission.name)
        return (
            djangoPermission.content_type.model
            + "_"
            + permType.__str__()
            + "_permission"
        )

    @staticmethod
    def create_manager_permission_from_django_permission(djangoPermission):
        permType = PermissionType.django_permission_name_to_type(djangoPermission.name)
        ManagerPermission.objects.get_or_create(
            name=RolesManager.django_permission_to_manager_permission_name(
                djangoPermission
            ),
            model=djangoPermission.content_type.model,
            description=djangoPermission.name,
            type=permType.__str__(),
        )
