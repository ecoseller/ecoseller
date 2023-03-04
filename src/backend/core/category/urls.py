from . import views
from django.urls import path


urlpatterns = [
    path("<int:id>/", views.CategoryView().as_view()),
]
