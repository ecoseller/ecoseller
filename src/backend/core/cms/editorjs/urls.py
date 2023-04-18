from django.urls import path
from . import views


urlpatterns = [
    path("upload/image/", views.EditorJSImageUploadView.as_view()),
    path("upload/url/", views.EditorJSURLUploadView.as_view()),
]
