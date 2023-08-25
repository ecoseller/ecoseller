from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
            "is_admin",
        )
        extra_kwargs = {
            "email": {"read_only": True},
        }

    def get_user_permissions(self, obj):
        return list(obj.user_permissions.all())


class TokenObtainDashboardSerializer(TokenObtainPairSerializer):
    """
    Serializes user profiles.
    Has following fields: email, password, dashboard_login, dashboard_user
    """

    dashboard_login = serializers.BooleanField(required=False, default=False)
    dashboard_user = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        refresh["dashboard_user"] = attrs.get("dashboard_user")
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["dashboard_login"] = attrs.get("dashboard_login")
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ChangePasswordSerializerAdmin(serializers.Serializer):
    """
    Serializer for admin password change endpoint.
    """

    new_password = serializers.CharField(required=True)
