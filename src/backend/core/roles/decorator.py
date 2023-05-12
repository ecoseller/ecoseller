from functools import wraps
from rest_framework.response import Response

from user.models import User

from .roles_manager import RolesManager


def check_user_access(wanted_permissions, user_id):
    user = User.objects.get(email=user_id)
    if user.is_admin:
        return True
    user_groups = user.groups.all()
    user_permissions = user.user_permissions.all()
    user_permissions_set = set()
    for perm in user_permissions:
        user_permissions_set.add(
            RolesManager.django_permission_to_manager_permission(perm).name
        )
    for group in user_groups:
        for perm in group.permissions.all():
            user_permissions_set.add(
                RolesManager.django_permission_to_manager_permission(perm).name
            )

    if wanted_permissions.issubset(user_permissions_set):
        return True
    return False


def check_user_access_decorator(permissions):
    """
    Decorator for checking if user has permission to access view.

    Parameters
    ----------
    permissions : set
        Set of permissions that user needs to have to access view

    Example
    -------
    To check if user has permission to view or change product, put following
    line above the view function:

    @check_user_access_decorator(
        {"Product_view_permission", "Product_change_permission"}
    )

    """

    def decorator(view_function):
        @wraps(view_function)
        def _wrapped_view(request, *args, **kwargs):
            if not check_user_access(permissions, kwargs.get("id")):
                return Response("User doesnt have permission", status=403)
            return view_function(request, *args, **kwargs)

        return _wrapped_view

    return decorator
