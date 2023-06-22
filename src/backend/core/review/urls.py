from django.urls import path
from . import views

urlpatterns = [
    path("storefront/create/", views.ReviewCreateStorefrontView.as_view()),
    path(
        "storefront/<str:product_id>/", views.ProductReviewListStorefrontView.as_view()
    ),
    path("dashboard/<str:token>/", views.ReviewDetailDashboardView.as_view()),
    path("dashboard/", views.ReviewListDashboardView.as_view()),
    path(
        "product-rating/<str:product_id>/",
        views.ProductRatingDetailView.as_view(),
    ),
]
