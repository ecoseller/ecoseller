from .models import User
from rest_framework import authentication
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings


class UserAuthBackend(authentication.BaseAuthentication):
    # Expects JWT token in request, from which username is extracted and user is returned
    def authenticate(self, request):
        try:
            token = request.META.get("HTTP_AUTHORIZATION", " ").split(" ")[1]
            data = {"token": token}
            valid_data = TokenBackend(
                algorithm=settings.SIMPLE_JWT["ALGORITHM"]
            ).decode(token, verify=False)
            username = valid_data["user_id"]
            user = User.objects.get(email=username)
            return user
        except Exception as e:
            print("Authenticate error", e)
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
