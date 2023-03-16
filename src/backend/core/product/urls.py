from django.urls import path
from . import views


urlpatterns = [
    path("storefront/<str:id>/", views.ProductDetailStorefront.as_view()),
    path("dashboard/", views.ProductListDashboard.as_view()),
    path("dashboard/variant/<str:sku>/", views.ProductVariantDashboard.as_view()),
    path("dashboard/detail/", views.ProductDetailDashboard.as_view()),
    path("dashboard/detail/<str:id>/", views.ProductDetailDashboard.as_view()),
    path("dashboard/pricelist/", views.PriceListDashboard.as_view()),
    path("dashboard/pricelist/<str:code>/", views.PriceListDashboard.as_view()),
    path("dashboard/attribute/type/", views.AttributeTypeDashboard.as_view()),
]
