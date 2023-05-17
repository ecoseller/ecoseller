import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


from rest_framework.parsers import (
    MultiPartParser,
)
import os
from django.conf import settings

import urllib.request


def editorjs_image_path(extension):
    # media path, folder editorjs and timestamp as filename + extension
    return os.path.join(
        settings.MEDIA_ROOT,
        "editorjs",
        f"{int(time.time())}.{extension}",
    )


def absolute_path_to_media(path):
    return path.replace(settings.MEDIA_ROOT, settings.MEDIA_URL).replace("//", "/")


class EditorJSImageUploadView(APIView):
    allowed_methods = ["POST"]
    parser_classes = (MultiPartParser,)
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        """
        Expect MultiPartParser to be used and save file to media folder
        """
        file_obj = request.FILES["file"]
        file_name = file_obj.name
        path = editorjs_image_path(file_name.split(".")[-1])
        # save file to media folder
        with open(path, "wb+") as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
        # return URL to uploaded file
        full_url = f"{path}"
        print(full_url)
        return Response({"file": absolute_path_to_media(full_url)}, status=201)


class EditorJSURLUploadView(APIView):
    allowed_methods = ["POST"]
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        """
        Expect JSON body to be used and contain URL to image.
        Save image to media folder and return URL to uploaded file
        """
        try:
            url = request.data["url"]
        except KeyError:
            return Response({"error": "URL not provided"}, status=400)

        result = urllib.request.urlopen(url)
        file_name = url.split("/")[-1]
        path = editorjs_image_path(file_name.split(".")[-1])
        # save file to media folder
        with open(path, "wb+") as destination:
            destination.write(result.read())
        # return URL to uploaded file
        full_url = f"{path}"
        print(full_url)
        return Response({"file": absolute_path_to_media(full_url)}, status=201)
