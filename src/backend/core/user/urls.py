from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views


urlpatterns = [
    path("detail", views.UserViewObs.as_view()),
    path("register", views.RegistrationView.as_view()),
    path("login", views.CustomTokenObtainPairView.as_view(), name="token_create"),
    path("logout", views.BlacklistTokenView.as_view()),
    path("refresh-token", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", views.UserView.as_view()),
    path("users/<str:id>", views.UserDetailView.as_view()),
    path("password", views.PasswordView.as_view()),
    path("password/<str:id>", views.PasswordAdminView.as_view()),
]
