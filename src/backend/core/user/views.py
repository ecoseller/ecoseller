from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.generics import UpdateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt import views as jwt_views

from roles.decorator import (
    check_user_access_decorator,
    check_user_is_staff_decorator,
)

from .models import User

from .serializers import (
    RegistrationSerializer,
    TokenObtainDashboardSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    ChangePasswordSerializerAdmin,
)


class UserView(GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = [
        "GET",
        "POST",
    ]

    serializer_class = RegistrationSerializer

    @check_user_is_staff_decorator()
    def get(self, request):
        users = self.get_queryset()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=200)

    @check_user_access_decorator({"user_add_permission"})
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)

    def get_queryset(self):
        return User.objects.all()


class UserDetailView(RetrieveUpdateDestroyAPIView):
    allowed_methods = ["GET", "PUT", "DELETE"]
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    lookup_field = "email"
    lookup_url_kwarg = "id"

    @check_user_is_staff_decorator()
    def get(self, request, id):
        return super().get(request, id)

    @check_user_access_decorator({"user_change_permission"})
    def put(self, request, id):
        return super().put(request, id)

    @check_user_access_decorator({"user_change_permission"})
    def delete(self, request, id):
        return super().delete(request, id)

    def get_queryset(self):
        return User.objects.all()


class RegistrationView(APIView):
    """
    View for registering new users.
    """

    # All views have authentication backend by default
    # We need to allow even unauthenticated users to register
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
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

    @check_user_is_staff_decorator()
    def get(self, request):
        user = request.user
        # auth = request.auth

        # currently triggers UserAuthBackend
        # user = authenticate(request)

        if user is None:
            return Response({"error": "User does not exist"}, status=400)

        serializer = UserSerializer(user)
        return Response(serializer.data)


class CustomTokenObtainPairView(jwt_views.TokenObtainPairView):
    serializer_class = TokenObtainDashboardSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            serializedData = self.serializer_class(data=request.data)
            serializedData.is_valid(raise_exception=True)
            dashboardLogin = serializedData.validated_data["dashboard_login"]
            user = User.objects.get(email=request.data["email"])
            if dashboardLogin is True and not user.is_staff:
                return Response({"error": "Not authorized"}, status=400)
            return response
        except Exception:
            return Response("Error login", status=400)


class PasswordView(UpdateAPIView):
    """
    View for users to change their password.
    """

    serializer_class = ChangePasswordSerializer
    permission_classes = (permissions.AllowAny,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def put(self, request):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=400)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "message": "Password updated successfully",
                "data": [],
            }
            return Response(response, status=200)

        return Response(serializer.errors, status=400)


class PasswordAdminView(UpdateAPIView):
    """
    View for admins to change users password.
    """

    serializer_class = ChangePasswordSerializerAdmin
    permission_classes = (permissions.AllowAny,)

    def get_object(self, queryset=None):
        obj = User.objects.get(email=self.kwargs["id"])
        return obj

    @check_user_access_decorator({"user_change_permission"})
    def put(self, request, id):
        try:
            self.object = self.get_object()
            serializer = self.get_serializer(data=request.data)

            print("AFTER SERIALIZER", serializer)

            if serializer.is_valid():
                print("AFTER SERIALIZER VALID")
                # set_password also hashes the password that the user will get
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                response = {
                    "message": "Password updated successfully",
                    "data": [],
                }
                return Response(response, status=200)

        except Exception as e:
            print("Error", e.message)
            return Response(status=400)
