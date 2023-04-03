from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .roles_manager import RolesManager, ManagerPermission, ManagerGroup
from .serializers import (
    ManagerGroupSerializer,
    ManagerPermissionSerializer,
)

from user.models import User

# Create your views here.


class UserGetPermissionsView(APIView):
    """
    View for getting user permissions.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Get all permissions for a user send in request body
    """

    def get(self, request, id):
        try:
            user = User.objects.get(email=id)
            permissions = user.user_permissions.all()
            groups = user.groups.all()

            # Transform drf permission to RolesManager permission
            nonSerializedPermissions = []
            for permission in permissions:
                permission = RolesManager.django_permission_to_manager_permission(
                    permission
                )
                nonSerializedPermissions.append(permission)
            for group in groups:
                for permission in group.permissions.all():
                    permission = RolesManager.django_permission_to_manager_permission(
                        permission
                    )
                    if permission not in nonSerializedPermissions:
                        nonSerializedPermissions.append(permission)

            serializedPermissions = []
            for permission in nonSerializedPermissions:
                serializedPerm = ManagerPermissionSerializer(permission)
                serializedPermissions.append(serializedPerm.data)

            return Response(serializedPermissions, status=200)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class UserAddPermissionView(APIView):
    """
    View for adding user permissions.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Add a permission to a user
    """

    def post(self, request):
        userEmail = request.data["user"]
        permissionName = request.data["permission_name"]

        try:
            permission = ManagerPermission.objects.get(name=permissionName)
            user = User.objects.get(email=userEmail)
            # Tranform permission string to permission object
            drfPermission = RolesManager.manager_permission_to_django_permission(
                permission
            )
            if drfPermission is None:
                return Response("Permission doesnt exist", status=400)

            user.user_permissions.add(drfPermission)
            user.save()
            return Response(status=201)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class UserRemovePermissionView(APIView):
    """
    View for removing user permissions.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Remove a permission from a user
    """

    def post(self, request):
        userEmail = request.data["user"]
        permission_name = request.data["permission_name"]

        try:
            permission = ManagerPermission.objects.get(name=permission_name)
            user = User.objects.get(email=userEmail)

            # Tranform permission string to permission object
            drfPermission = RolesManager.manager_permission_to_django_permission(
                permission
            )
            if drfPermission is None:
                return Response("Permission doesnt exist", status=400)

            if not user.has_perm(drfPermission):
                return Response("User doesnt have permission", status=400)

            user.user_permissions.remove(drfPermission)
            user.save()
            return Response(status=201)
        except ManagerPermission.DoesNotExist:
            return Response("Permission doesnt exist", status=400)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class UserGetGroupsView(APIView):
    """
    View for getting user groups.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Get all groups for a user send in request body
    """

    def get(self, request, id):
        try:
            user = User.objects.get(email=id)
            groups = user.groups.all()

            # Transform drf groups to RolesManager groups
            nonSerializedGroups = []
            for group in groups:
                group = RolesManager.django_group_to_manager_group(group)
                nonSerializedGroups.append(group)

            serializedGroups = []
            for group in nonSerializedGroups:
                serializedGroup = ManagerGroupSerializer(group)
                serializedGroups.append(serializedGroup.data)

            return Response(serializedGroups, status=200)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class UserAddGroupView(APIView):
    """
    View for adding user groups.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Add a group to a user
    """

    def post(self, request):
        userEmail = request.data["user"]
        groupName = request.data["group_name"]

        try:

            user = User.objects.get(email=userEmail)
            group = ManagerGroup.objects.get(name=groupName)
            # Tranform group string to group object
            drfGroup = RolesManager.manager_group_to_django_group(group)
            if drfGroup is None:
                return Response("Group doesnt exist", status=400)

            user.groups.add(drfGroup)
            user.save()
            return Response(status=201)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class UserRemoveGroupView(APIView):
    """
    View for removing user groups.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Remove a group from a user
    """

    def post(self, request):
        userEmail = request.data["user"]
        groupName = request.data["group_name"]

        try:
            group = ManagerGroup.objects.get(name=groupName)
            user = User.objects.get(email=userEmail)

            # Tranform group string to group object
            drfGroup = RolesManager.manager_group_to_django_group(group)
            if drfGroup is None:
                return Response("Group doesnt exist", status=400)

            if not user.groups.filter(name=drfGroup.name).exists():
                return Response("User doesnt have group", status=400)

            user.groups.remove(drfGroup)
            user.save()
            return Response(status=201)
        except ManagerGroup.DoesNotExist:
            return Response("Group doesnt exist", status=400)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class GetPermissionDetailView(APIView):
    """
    View for getting permission details.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Get all permissions for a user send in request body
    """

    def get(self, request, id):
        try:
            permission = ManagerPermission.objects.get(name=id)
            serializedPermission = ManagerPermissionSerializer(permission)

            return Response(serializedPermission.data, status=200)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class GetGroupDetailView(APIView):
    """
    View for getting group permissions.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Get all permissions for a group send in request body
    """

    def get(self, request, id):
        try:
            group = ManagerGroup.objects.get(name=id)
            serializedGroup = ManagerGroupSerializer(group)

            return Response(serializedGroup.data, status=200)
        except Exception as e:
            print("Error", e)
            return Response(status=400)


class CreateGroupView(APIView):
    """
    View for creating a group.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    """
    Create a group
    """

    def post(self, request):
        groupName = request.data["group_name"]
        groupPermissions = request.data["group_permissions"]
        groupDescription = request.data["group_description"]

        try:
            if ManagerGroup.objects.filter(name=groupName).exists():
                return Response("Group already exists", status=400)

            group = ManagerGroup(name=groupName, description=groupDescription)
            group.save()

            for permission in groupPermissions:
                permission = ManagerPermission.objects.get(name=permission)
                group.permissions.add(permission)

            group.save()

            return Response(status=201)
        except Exception as e:
            print("Error", e)
            return Response(status=400)
