from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views


urlpatterns = [
    path("detail", views.UserView.as_view()),
    path("register", views.RegistrationView.as_view()),
    path("login", jwt_views.TokenObtainPairView.as_view(), name="token_create"),
    path("logout", views.BlacklistTokenView.as_view()),
    path("refresh-token", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
]
