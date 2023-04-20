from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views


urlpatterns = [
    path("detail", views.UserViewObs.as_view()),
    path("usersObs", views.UsersView.as_view()),
    path("register", views.RegistrationView.as_view()),
    path("login", jwt_views.TokenObtainPairView.as_view(), name="token_create"),
    path("logout", views.BlacklistTokenView.as_view()),
    path("refresh-token", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("delete-user", views.DeleteUserView.as_view()),
    path("update-user", views.UpdateUserView.as_view()),
    # new paths
    path("users", views.UserView.as_view()),
    path("users/<str:id>", views.UserDetailView.as_view()),
]
