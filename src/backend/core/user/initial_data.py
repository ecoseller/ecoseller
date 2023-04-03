from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import Group, Permission

from roles.models import ManagerGroup

from roles.roles_manager import RolesManager


def populate_groups(apps, schema_editor):
    """
    This function is run in migrations/0002_initial_data.py as an initial
    data migration at project initialization. it sets up some basic model-level
    permissions for different groups when the project is initialised.
    """

    # Load config
    RolesManager.load_roles_from_config("./roles/config/roles.json")

    # Create user groups
    for groupName in ManagerGroup.objects.all().values_list("name", flat=True):
        Group.objects.create(name=groupName)

    # Permissions have to be created before applying them
    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, verbosity=0)
        app_config.models_module = None

    # Convert all django permissions to ManagerPermissions
    for perm in Permission.objects.all():
        RolesManager.create_manager_permission_from_django_permission(perm)

    # Assign permissions to groups
    for groupName in ManagerGroup.objects.all().values_list("name", flat=True):
        group = Group.objects.get(name=groupName)
        for perm in ManagerGroup.objects.get(name=groupName).permissions.all():
            djangoPerm = RolesManager.manager_permission_to_django_permission(perm)
            if djangoPerm is not None:
                group.permissions.add(djangoPerm)
