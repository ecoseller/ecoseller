from functools import wraps
from rest_framework.response import Response

from .roles_manager import RolesManager


def check_user_access(wanted_permissions, user):
    print("Check user access: user: ", user)
    if user is None or user.is_anonymous:
        return False
    if user.is_admin:
        print("Check user access: user is admin")
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
        print("Check user access: user has permission")
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
            user = args[0].user
            print("Check user access decorator: ", user)
            if not check_user_access(permissions, user):
                return Response("User doesnt have permission", status=403)
            return view_function(request, *args, **kwargs)

        return _wrapped_view

    return decorator


def check_user_is_staff(user):
    print("Check user is staff: user: ", user)
    if user is None or user.is_anonymous:
        return False
    if user.is_admin:
        print("Check user is staff: user is admin")
        return True
    if user.is_staff:
        print("Check user is staff: user is staff")
        return True
    return False


def check_user_is_staff_decorator():
    """
    Decorator for checking if user has permission to access view.
    This decorator should encapsulate GET views for dashboard.

    Example
    -------
    To check if user has permission to get data, put following
    line above the view function:

    @check_user_is_staff_decorator(
        {"Product_view_permission", "Product_change_permission"}
    )

    """

    def decorator(view_function):
        @wraps(view_function)
        def _wrapped_view(request, *args, **kwargs):
            user = args[0].user
            if not check_user_is_staff(user):
                return Response("User doesnt have permission", status=403)
            return view_function(request, *args, **kwargs)

        return _wrapped_view

    return decorator
