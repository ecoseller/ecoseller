from rest_framework import serializers

from .models import (
    User,
)


class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializers registration requests and creates a new user.
    """

    class Meta:
        model = User
        fields = (
            "email",
            "password",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                email=validated_data["email"],
                password=validated_data["password"],
            )
        except Exception as e:
            return {"error": e}

        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes user profiles.
    """

    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "birth_date",
            "is_active",
            "is_admin",
            "is_staff",
        )

    def get_user_permissions(self, obj):
        return list(obj.user_permissions.all())


class UpdateUserSerializer(serializers.Serializer):
    """
    Serialize user update data
    """

    email = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    is_admin = serializers.BooleanField()
    groups = serializers.ListField(child=serializers.CharField(), default=[])
