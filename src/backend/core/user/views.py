from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegistrationSerializer,
    UserSerializer,
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
