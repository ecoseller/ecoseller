from django.urls import path
from . import views

urlpatterns = [
    path(
        "get-permissions/<str:id>",
        views.UserGetPermissionsView.as_view(),
        name="user-permissions",
    ),
    path(
        "set-permission", views.UserAddPermissionView.as_view(), name="set-permission"
    ),
    path(
        "remove-permission",
        views.UserRemovePermissionView.as_view(),
        name="remove-permission",
    ),
    path(
        "group-detail/<str:id>",
        views.GetGroupDetailView.as_view(),
        name="group-permissions",
    ),
    path("permission-detail/<str:id>", views.GetPermissionDetailView.as_view()),
    path("get-groups/<str:id>", views.UserGetGroupsView.as_view()),
    path("set-group", views.UserAddGroupView.as_view()),
    path("remove-group", views.UserRemoveGroupView.as_view()),
]
