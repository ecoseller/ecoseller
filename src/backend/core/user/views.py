from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Profile
from .serializers import (
    RegistrationSerializer,
    ProfileSerializer,
    LoginSerializer,
)
from django.conf import settings

import jwt

class RegistrationView(APIView):
    """
    View for registering new users.
    """
    def post(self, request):
        print("IN POST AT REGISTRATION VIEW")
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)


class LoginView(APIView):
    """
    View for logging in users.
    """
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)
            token = serializer.data.get('token')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'token': token
            }
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class LogoutView(APIView):
    """
    View for logging out users.
    """
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


#create view that returns user data from token
class UserView(APIView):
    """
    View for testing purposes.
    Print user data from token acquired from cookies.
    """
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if token is None:
            return Response({"error": "Missing auth token"}, status=400)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, settings.SIMPLE_JWT['ALGORITHM'])
        except jwt.ExpiredSignatureError:
            return Response({"error": "Expired token"}, status=400)
        except jwt.DecodeError:
            return Response({"error": "Invalid token"}, status=400)
        
        user = Profile.objects.filter(id=payload['id']).first()
        if user is None:
            return Response({"error": "User does not exist"}, status=400)
        
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
