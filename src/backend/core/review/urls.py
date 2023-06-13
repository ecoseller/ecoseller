from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.ReviewCreateStorefrontView.as_view()),
    path("<str:product_id>/", views.ProductReviewListStorefrontView.as_view()),
    path("<str:token>/", views.ReviewDetailView.as_view()),
]
