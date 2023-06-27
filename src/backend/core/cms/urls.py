from . import views
from django.urls import path


urlpatterns = [
    path("", views.PageDashboardView().as_view()),
    path("page/frontend/<int:pk>/", views.PageFrontendDashboardDetailView.as_view()),
    path("page/cms/<int:pk>/", views.PageCMSDashboardDetailView.as_view()),
    path("category/type/", views.PageCategoryTypeDashboardView.as_view()),
    path("category/type/<int:pk>/", views.PageTypeDashboardDetailView.as_view()),
    path("category/type/<int:pk>/pages/", views.PageTypePagesDashboardView.as_view()),
    path("category/", views.PageCategoryDashboardView.as_view()),
    path("category/<int:pk>/", views.PageCategoryDashboardDetailView.as_view()),
    path("category/<int:pk>/pages/", views.PageCategoryPagesDashboardView.as_view()),
    path(
        "storefront/page/cms/<str:locale>/<str:slug>/",
        views.PageCMSStorefrontDetailView.as_view(),
    ),
]
