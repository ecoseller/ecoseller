from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Profile
from .serializers import RegistrationSerializer

class RegistrationView(APIView):
    """
    View for registering new users.
    """
    def post(self, request):
        print("IN POST AT REGISTRATION VIEW")
        serializer = RegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        print("SERIALIZER IS VALID")
        serializer.save()
        return Response(serializer.data, status=201)

#create view that lists all users
class ListUsers(APIView):
    def get(self, request):
        users = Profile.objects.all()
        print('USERS:')
        for user in users:
            print(user)
            print(user.token)

        return Response()

    def put(self, request, id):
        raise NotImplementedError

    def delete(self, request, id):
        raise NotImplementedError
