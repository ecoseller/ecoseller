from .models import Profile
from django.contrib.auth.backends import BaseBackend

class ProfileAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = Profile.objects.get(email=username)
            if user.check_password(password):
                return user
            return None
        except Profile.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Profile.objects.get(pk=user_id)
        except Profile.DoesNotExist:
            return None