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
            "is_admin",
        )
        extra_kwargs = {
            "email": {"read_only": True},
        }

    def get_user_permissions(self, obj):
        return list(obj.user_permissions.all())

    # def update(self, instance, validated_data):
    #     email = validated_data.pop("email")
    #     user = User.objects.filter(email=email).first()
    #     if user:
    #         instance.user = user
    #     return super().update(instance, validated_data)


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TokenObtainDashboardSerializer(TokenObtainPairSerializer):
    """
    Serializes user profiles.
    Has following fields: email, password, dashboard_login
    """

    dashboard_login = serializers.BooleanField(required=False, default=False)

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["dashboard_login"] = attrs.get("dashboard_login")
        return data
