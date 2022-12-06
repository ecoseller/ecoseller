from rest_framework.serializers import (
    ModelSerializer,
)

from .models import (
    Profile,
)

class RegistrationSerializer(ModelSerializer):
    """
    Serializers registration requests and creates a new user.
    """
    class Meta:
        model = Profile
        fields = (
            "email",
            "password",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        try:
            user = Profile.objects.create_user(
                email=validated_data["email"],
                password=validated_data["password"],
            )
        except Exception as e:
            return {"error": e}

        return user

