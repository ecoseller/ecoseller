from django.urls import path
from . import views


urlpatterns = [
    path("", views.CountryListView.as_view()),
    path("vat-group/", views.VatGroupListView.as_view()),
    path("vat-group/<int:id>/", views.VatGroupDetailView.as_view()),
    path("languages/", views.LanguagesView.as_view()),
    path("currency/", views.CurrencyListView.as_view()),
    path("currency/<str:code>/", views.CurrencyDetailView.as_view()),
    path("<str:code>/", views.CountryDetailView.as_view()),
    path("address/shipping/<int:id>/", views.ShippingAddressDetailView.as_view()),
    path("address/billing/<int:id>/", views.ShippingAddressDetailView.as_view()),
    path("dashboard/address/shipping/", views.ShippingInfoListView.as_view()),
    path("dashboard/address/billing/", views.BillingInfoListView.as_view()),
    path(
        "dashboard/address/shipping/<str:user_id>/",
        views.ShippingInfoListUserView.as_view(),
    ),
    path(
        "dashboard/address/billing/<str:user_id>/",
        views.BillingInfoListUserView.as_view(),
    ),
    path("storefront/address/shipping/", views.ShippingInfoUserView.as_view()),
    path("storefront/address/billing/", views.BillingInfoUserView.as_view()),
]
