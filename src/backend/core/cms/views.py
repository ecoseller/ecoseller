from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import permissions


from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
    FileUploadParser,
    JSONParser,
)
import os
from django.conf import settings
