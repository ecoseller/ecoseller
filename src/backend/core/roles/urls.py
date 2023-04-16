from django.urls import path
from . import views

urlpatterns = [
    path("user-permissions/<str:id>", views.UserPermissionView.as_view()),
    path("user-groups/<str:id>", views.UserGroupView.as_view()),
    path("groups/<str:id>", views.GroupDetailView.as_view()),
    path("permission/<str:id>", views.PermissionDetailView.as_view()),
    path("groups", views.GroupView.as_view()),
    path("permissions", views.PermissionView.as_view()),
]
