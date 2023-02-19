from .models import User
from django.contrib.auth.backends import BaseBackend


class UserAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            print("AUTHENTICATING")
            print(username, password)
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
