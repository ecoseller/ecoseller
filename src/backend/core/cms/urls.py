from . import views
from django.urls import path


urlpatterns = [
    path("", views.PageDashboardView().as_view()),
    path("page/frontend/<int:pk>/", views.PageFrontendDashboardDetailView.as_view()),
    path("page/cms/<int:pk>/", views.PageCMSDashboardDetailView.as_view()),
]
