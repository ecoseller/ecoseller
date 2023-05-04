from django.urls import path
from . import views


urlpatterns = [
    path("storefront/<int:pk>/", views.ProductDetailStorefront.as_view()),
    path("dashboard/type/", views.ProductTypeDashboardView.as_view()),
    path("dashboard/type/<int:id>/", views.ProductTypeDashboardDetailView.as_view()),
    path("dashboard/type/vat-group/", views.ProductTypeVatGroupDashboardView.as_view()),
    path(
        "dashboard/type/vat-group/<int:id>/",
        views.ProductTypeVatGroupDashboardDetailView.as_view(),
    ),
    path("dashboard/", views.ProductListDashboard.as_view()),
    path("dashboard/variant/<str:sku>/", views.ProductVariantDashboard.as_view()),
    path("dashboard/detail/", views.ProductDashboardView.as_view()),
    path("dashboard/detail/<int:id>/", views.ProductDetailDashboardView.as_view()),
    path("dashboard/pricelist/", views.PriceListDashboardView.as_view()),
    path(
        "dashboard/pricelist/<str:code>/", views.PriceListDashboardDetailView.as_view()
    ),
    path("dashboard/attribute/type/", views.AttributeTypeDashboardView.as_view()),
    path(
        "dashboard/attribute/type/<int:id>/",
        views.AttributeTypeDashboardDetailView.as_view(),
    ),
    path("dashboard/attribute/", views.BaseAttributeDashboardView.as_view()),
    path(
        "dashboard/attribute/<int:id>/",
        views.BaseAttributeDashboardDetailView.as_view(),
    ),
    path("dashboard/media/", views.ProductMediaUpload.as_view()),
    path("dashboard/media/<int:id>/", views.ProductMediaUploadDetailView.as_view()),
]
