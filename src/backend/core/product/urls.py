from django.urls import path
from . import views


urlpatterns = [
    path("dashboard/type/", views.ProductTypeDashboardView.as_view()),
    path("dashboard/type/<str:id>/", views.ProductTypeDashboardDetailView.as_view()),
    path("storefront/<str:id>/", views.ProductDetailStorefront.as_view()),
    path("dashboard/", views.ProductListDashboard.as_view()),
    path("dashboard/variant/<str:sku>/", views.ProductVariantDashboard.as_view()),
    path("dashboard/detail/", views.ProductDashboardView.as_view()),
    path("dashboard/detail/<str:id>/", views.ProductDetailDashboardView.as_view()),
    path("dashboard/pricelist/", views.PriceListDashboardView.as_view()),
    path(
        "dashboard/pricelist/<str:code>/", views.PriceListDashboardDetailView.as_view()
    ),
    path("dashboard/attribute/type/", views.AttributeTypeDashboard.as_view()),
]
