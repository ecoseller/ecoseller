from django.urls import path, include
from . import views


urlpatterns = [
    path("upload/image/", views.EditorJSImageUploadView.as_view()),
    path("upload/url/", views.EditorJSURLUploadView.as_view()),
]
