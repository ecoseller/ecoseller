from django.contrib.auth.models import Group
from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from roles.decorator import check_user_access_decorator
from roles.decorator import check_user_is_staff_decorator
from user.models import User
from .roles_manager import RolesManager, ManagerPermission, ManagerGroup
from .serializers import (
    ManagerGroupSerializer,
    ManagerPermissionSerializer,
)


# Create your views here.


class UserPermissionView(GenericAPIView):
    """
    View for getting dashboard permissions of the current user
    """

    allowed_methods = [
        "GET",
    ]
    serializer_class = ManagerPermissionSerializer

    @check_user_is_staff_decorator()
    def get(self, request, id):
        userPerms = self.get_queryset()
        if userPerms is None:
            return Response(status=400)
        serializedPermissions = []
        for permission in userPerms:
            serializedPerm = self.serializer_class(permission)
            serializedPermissions.append(serializedPerm.data)
        return Response(serializedPermissions, status=200)

    def get_queryset(self):
        try:
            user = User.objects.get(email=self.kwargs["id"])
            groups = user.groups.all()

            # Transform drf permission to RolesManager permission
            nonSerializedPermissions = []
            for group in groups:
                for permission in group.permissions.all():
                    permission = RolesManager.django_permission_to_manager_permission(
                        permission
                    )
                    if permission not in nonSerializedPermissions:
                        nonSerializedPermissions.append(permission)
            return nonSerializedPermissions
        except Exception as e:
            print("Error", e)
            return None


class UserGroupView(GenericAPIView):
    """
    View for getting and updating dashboard manager groups of the current user
    """

    allowed_methods = [
        "GET",
        "PUT",
    ]
    serializer_class = ManagerGroupSerializer

    @check_user_is_staff_decorator()
    def get(self, request, id):
        try:
            groups = self.get_queryset()
            if groups is None:
                return Response(status=400)

            # Transform drf groups to RolesManager groups
            nonSerializedGroups = []
            for group in groups:
                group = RolesManager.django_group_to_manager_group(group)
                nonSerializedGroups.append(group)

            serializedGroups = []
            for group in nonSerializedGroups:
                serializedGroup = self.serializer_class(group)
                serializedGroups.append(serializedGroup.data)

            return Response(serializedGroups, status=200)
        except Exception as e:
            print("Error", e)
            return Response(status=400)

    @check_user_access_decorator({"user_change_permission"})
    def put(self, request, id):
        user = User.objects.get(email=id)
        userGroups = user.groups.all()
        userManagerGroups = []
        for group in userGroups:
            group = RolesManager.django_group_to_manager_group(group)
            userManagerGroups.append(group)

        user.groups.clear()
        newGroups = request.data["roles"]

        for group in newGroups:
            drfGroup = RolesManager.manager_group_to_django_group(group)
            if drfGroup is None:
                for grp in userManagerGroups:
                    grp = RolesManager.manager_group_to_django_group(grp.name)
                    if grp is None:
                        return Response(status=400)
                    user.groups.add(grp)
                user.save()
                return Response(status=400)
            user.groups.add(drfGroup)

        user.save()
        return Response(status=200)

    def get_queryset(self):
        try:
            user = User.objects.get(email=self.kwargs["id"])
            print(user.groups.all())
            return user.groups.all()
        except Exception:
            return None


class GroupDetailView(GenericAPIView):
    """
    View for getting, updating and deleting dashboard maanger groups
    """

    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "DELETE",
        "PUT",
    ]
    serializer_class = ManagerGroupSerializer

    @check_user_is_staff_decorator()
    def get(self, request, id):
        groups = self.get_queryset()
        try:
            group = groups.get(name=id)

            serGroup = self.serializer_class(group)
            return Response(serGroup.data, status=200)
        except Exception as e:
            print(e)
            return Response(status=400)

    @check_user_access_decorator({"group_change_permission"})
    def delete(self, request, id):
        managerGroups = self.get_queryset()
        try:
            managerGroup = managerGroups.get(name=id)
            managerGroup.delete()

            drfGroup = RolesManager.manager_group_to_django_group(id)
            if drfGroup is None:
                return Response(status=400)
            drfGroup.delete()

            return Response(status=200)
        except Exception:
            return Response(status=400)

    @check_user_access_decorator({"group_change_permission"})
    def put(self, request, id):
        group = self.serializer_class(data=request.data)
        if not group.is_valid():
            return Response(status=400)
        try:
            existingGroup = ManagerGroup.objects.get(name=group.data["name"])
            existingGroup.description = group.data["description"]
            existingGroup.permissions.clear()
            for permission in group.data["permissions"]:
                perm = ManagerPermission.objects.get(name=permission["name"])
                existingGroup.permissions.add(perm)

            existingGroup.save()

            drfGroup = RolesManager.manager_group_to_django_group(group.data["name"])
            if drfGroup is None:
                return Response(status=400)
            drfGroup.permissions.clear()
            for managerPermission in group.data["permissions"]:
                perm = ManagerPermission.objects.get(name=managerPermission["name"])
                drfPermission = RolesManager.manager_permission_to_django_permission(
                    perm
                )
                if drfPermission is None:
                    return Response(status=400)
                drfGroup.permissions.add(drfPermission)

            return Response(status=200)
        except Exception as e:
            print(e)
            return Response(status=400)

    def get_queryset(self):
        return ManagerGroup.objects.all()


class PermissionDetailView(GenericAPIView):
    """
    View for getting and removing dashboard permission
    """

    allowed_methods = [
        "GET",
        "DELETE",
    ]
    serializer_class = ManagerPermissionSerializer

    @check_user_is_staff_decorator()
    def get(self, request, id):
        permissions = self.get_queryset()
        try:
            permission = permissions.get(name=id)

            serPermission = self.serializer_class(permission)
            return Response(serPermission.data, status=200)
        except Exception:
            return Response(status=400)

    @check_user_access_decorator({"group_change_permission"})
    def delete(self, request, id):
        permissions = self.get_queryset()
        try:
            permission = permissions.get(name=id)
            groups = ManagerGroup.objects.all()
            for group in groups:
                if group.permissions.filter(name=permission.name).exists():
                    return Response(
                        "Permission exists in group {}, cannot be deleted".format(
                            group.name
                        ),
                        status=400,
                    )
            permission.delete()
            return Response(status=200)
        except Exception:
            return Response(status=400)

    def get_queryset(self):
        return ManagerPermission.objects.all()


class GroupView(GenericAPIView):
    """
    View for listing and creating dashboard manager groups
    """

    allowed_methods = [
        "GET",
        "POST",
    ]
    serializer_class = ManagerGroupSerializer

    @check_user_is_staff_decorator()
    def get(self, request):
        groups = self.get_queryset()
        serGroups = []
        for group in groups:
            serGroups.append(self.serializer_class(group).data)
        return Response(serGroups, status=200)

    @check_user_access_decorator({"group_add_permission"})
    def post(self, request):
        groupName = request.data["name"]
        groupPermissions = request.data["permissions"]
        groupDescription = request.data["description"]

        try:
            if ManagerGroup.objects.filter(name=groupName).exists():
                return Response("Group already exists", status=400)

            group = ManagerGroup(name=groupName, description=groupDescription)
            group.save()

            for permission in groupPermissions:
                permission = ManagerPermission.objects.get(name=permission)
                if permission is None:
                    return Response("Permission doesnt exist", status=400)
                group.permissions.add(permission)

            drfGroup = Group.objects.create(name=groupName)
            for permission in group.permissions.all():
                drfPerm = RolesManager.manager_permission_to_django_permission(
                    permission
                )
                drfGroup.permissions.add(drfPerm)

            group.save()
            drfGroup.save()

            return Response(status=201)
        except Exception as e:
            print("Error", e)
            group = ManagerGroup.objects.get(name=groupName)
            group.delete()
            return Response(status=400)

    def get_queryset(self):
        return ManagerGroup.objects.all()


class PermissionView(GenericAPIView):
    """
    View for listing all dashboard permissions
    """

    allowed_methods = [
        "GET",
    ]
    serializer_class = ManagerPermissionSerializer

    @check_user_is_staff_decorator()
    def get(self, request):
        # return just a few permissions that actually makes sense
        filterModels = [
            "group",
            "cart",
            "category",
            "page",
            "productprice",
            "productmedia",
            "product",
            "user",
            "order",
        ]
        filterActions = ["change", "add"]
        permissions = self.get_queryset().values()
        perms = []
        for permission in permissions:
            for action in filterActions:
                for model in filterModels:
                    modelName = permission["name"].split("_")[0]
                    if (
                        action in permission["name"]
                        and model == modelName
                        and permission not in perms
                    ):
                        perms.append(permission)

        serPermissions = []
        for permission in perms:
            serPermissions.append(self.serializer_class(permission).data)
        return Response(serPermissions, status=200)

    def get_queryset(self):
        return ManagerPermission.objects.all()
