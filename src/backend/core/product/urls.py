from django.urls import path
from . import views


urlpatterns = [
    path("storefront/<int:id>/", views.ProductDetailStorefront.as_view()),
    path("dashboard/", views.ProductListDashboard.as_view()),
    path("dashboard/<int:id>/", views.ProductDetailDashboard.as_view()),
]
