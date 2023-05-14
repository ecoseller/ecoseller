from .models import User
from rest_framework import authentication
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings


class UserAuthBackend(authentication.BaseAuthentication):
    # Expects JWT token in request, from which username is extracted and user is returned
    def authenticate(self, request):
        try:
            token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
            valid_data = TokenBackend(
                algorithm=settings.SIMPLE_JWT["ALGORITHM"]
            ).decode(token, verify=False)
            username = valid_data["user_id"]
            user = User.objects.get(email=username)
            print("User auth backend: ", user)
            return user
        except Exception as e:
            print("Authenticate error", e)
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
