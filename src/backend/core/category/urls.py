from django.urls import path

from . import views

urlpatterns = [
    path("dashboard/", views.CategoryDashboardView.as_view()),
    path("dashboard/<int:pk>/", views.CategoryDetailDashboardView.as_view()),
    path("storefront/", views.CategoryStorefrontView.as_view()),
    path("storefront/<int:pk>/", views.CategoryDetailStorefrontView.as_view()),
    path(
        "storefront/<int:pk>/products/",
        views.CategoryDetailProductsStorefrontView.as_view(),
    ),
    path(
        "storefront/<int:pk>/attributes/",
        views.CategoryDetailAttributesStorefrontView.as_view(),
    ),
    # path("dashboard/<int:id>/children/", views.CategoryChildrenViewDashboard.as_view()),
]
