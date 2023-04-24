from . import views
from django.urls import path


urlpatterns = [
    path("", views.PageDashboardView().as_view()),
    path("page/frontend/<int:pk>/", views.PageFrontendDashboardDetailView.as_view()),
    path("page/cms/<int:pk>/", views.PageCMSDashboardDetailView.as_view()),
    path("category/", views.PageCategoryDashboardView.as_view()),
    path("category/<int:pk>/", views.PageCategoryDashboardDetailView.as_view()),
    path("category/<int:pk>/pages/", views.PageCategoryPagesDashboardView.as_view()),
]
