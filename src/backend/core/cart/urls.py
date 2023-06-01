from django.urls import path

from . import views

urlpatterns = [
    path("dashboard/payment/method/", views.PaymentMethodListDashboardView.as_view()),
    path(
        "dashboard/payment/method/<int:id>/",
        views.PaymentMethodDetailDashboardView.as_view(),
    ),
    path(
        "dashboard/payment/method/<int:method_id>/country/",
        views.PaymentMethodCountryListView.as_view(),
    ),
    path(
        "dashboard/payment/method/country/",
        views.PaymentMethodCountryFullListView.as_view(),
    ),
    path(
        "dashboard/payment/method/<int:method_id>/country/<int:id>/",
        views.PaymentMethodCountryDetailDashboardView.as_view(),
    ),
    path("dashboard/shipping/method/", views.ShippingMethodListDashboardView.as_view()),
    path(
        "dashboard/shipping/method/<int:id>/",
        views.ShippingMethodDetailDashboardView.as_view(),
    ),
    path(
        "dashboard/shipping/method/<int:method_id>/country/",
        views.ShippingMethodCountryListView.as_view(),
    ),
    path(
        "dashboard/shipping/method/<int:method_id>/country/<int:id>/",
        views.ShippingMethodCountryDetailDashboardView.as_view(),
    ),
    path("storefront/", views.CartCreateStorefrontView.as_view()),
    path("storefront/<str:token>/", views.CartDetailStorefrontView.as_view()),
    path(
        "storefront/<str:token>/detail/", views.CartDetailShortStorefrontView.as_view()
    ),
    path(
        "storefront/<str:token>/update-quantity/",
        views.CartUpdateQuantityStorefrontView.as_view(),
    ),
    path(
        "dashboard/<str:token>/update-quantity/",
        views.CartUpdateQuantityDashboardView.as_view(),
    ),
    path(
        "storefront/<str:token>/billing-info/",
        views.CartUpdateBillingInfoStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/shipping-info/",
        views.CartUpdateShippingInfoStorefrontView.as_view(),
    ),
    path(
        "storefront/methods/<str:country_code>/",
        views.CartCountryMethodsStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/payment-method/",
        views.CartSelectedPaymentMethodStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/shipping-method/",
        views.CartSelectedShippingMethodStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/payment-method/<int:id>/",
        views.CartUpdatePaymentMethodStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/shipping-method/<int:id>/",
        views.CartUpdateShippingMethodStorefrontView.as_view(),
    ),
    path(
        "storefront/<str:token>/<str:sku>/",
        views.CartItemDeleteStorefrontView.as_view(),
    ),
    path(
        "dashboard/<str:token>/<str:sku>/",
        views.CartItemDeleteDashboardView.as_view(),
    ),
]
