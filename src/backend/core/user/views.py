from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from roles.roles_manager import RolesManager, ManagerPermission, ManagerGroup

from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    UpdateUserSerializer,
)


class UserView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]
    authentication_classes = []
    serializer_class = RegistrationSerializer

    def get(self, request):
        users = self.get_queryset()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)

    def get_queryset(self):
        return User.objects.all()


class UserDetailView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "PUT",
    ]
    authentication_classes = []
    serializer_class = UpdateUserSerializer

    def get(self, request, id):
        pass
        # user = self.get_queryset()
        # if User is None:
        #     return Response(status=400)

        # serUser = self.serializer_class(
        #     email=user.email, first_name=user.first_name, last_name=user.last_name
        # )
        # return Response(status=200)

    def put(self, request, id):
        pass

    def get_queryset(self):
        try:
            user = User.objects.get(email=self.kwargs["id"])
            return user
        except Exception:
            return None


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
class UserViewObs(APIView):
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
