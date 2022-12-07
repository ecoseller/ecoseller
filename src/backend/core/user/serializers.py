from rest_framework import serializers
from django.contrib.auth import authenticate

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


class LoginSerializer(serializers.Serializer):
    """
    Serializes login requests and returns a token with email.
    """

    email = serializers.EmailField()
    access_token = serializers.CharField(read_only=True)
    refresh_token = serializers.CharField(read_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        if email is None or password is None:
            raise serializers.ValidationError("Please provide both email and password")

        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("This user has been deactivated.")

        return {"access_token": user.access_token,
                "refresh_token": user.refresh_token,
                "email": user.email,}


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
