from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    UpdateUserSerializer,
)


class RegistrationView(APIView):
    """
    View for registering new users.
    """

    # All views have authentication backend by default
    # We need to allow even unauthenticated users to register
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("IN POST AT REGISTRATION VIEW")
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)


class BlacklistTokenView(APIView):
    """
    View for blacklisting refresh token after user logout
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=201)
        except Exception as e:
            print("LOGOUT Error", e)
            return Response(status=400)


# create view that returns user data from token
class UserView(APIView):
    """
    View for testing purposes.
    Print user data from token passed in header.
    """

    def get(self, request):
        user = request.user
        auth = request.auth

        # currently triggers UserAuthBackend
        # user = authenticate(request)

        print("USER", user)
        print("AUTH", auth)

        if user is None:
            return Response({"error": "User does not exist"}, status=400)

        serializer = UserSerializer(user)
        return Response(serializer.data)


class UsersView(APIView):
    """
    View for retrieving all users.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=200)


class DeleteUserView(APIView):
    """
    View for deleting a user.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    def post(self, request):
        try:
            user = User.objects.get(email=request.data["email"])
            user.delete()
            return Response(status=200)
        except Exception as e:
            print("DELETE USER Error", e)
            return Response(status=400)


class CreateUserView(APIView):
    """
    View for creating a user.
    """

    permission_classes = (permissions.AllowAny,)
    # In later phases we will need to restrict this to admins only

    def post(self, request):
        try:
            serializer = RegistrationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)
            serializer.save()
            return Response(serializer.data, status=201)
        except Exception as e:
            print("CREATE USER Error", e)
            return Response(status=400)


class UpdateUserView(APIView):
    """
    View for updating a user.
    """

    def post(self, request):
        pass
