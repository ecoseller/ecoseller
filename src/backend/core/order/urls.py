from django.urls import path

from . import views

urlpatterns = [
    path("dashboard/", views.OrderListDashboardView.as_view()),
    path("dashboard/today-stats/", views.OrderListTodayDashboardView.as_view()),
    path("dashboard/month-stats/", views.OrderListMonthDashboardView.as_view()),
    path("dashboard/complaint/<int:id>", views.OrderItemComplaintDashboardView.as_view()),
    path("dashboard/<str:token>/", views.OrderDetailDashboardView.as_view()),
    path("storefront/", views.OrderCreateStorefrontView.as_view()),
    path("storefront/orders/", views.OrderListStorefrontView.as_view()),
    path("storefront/complaint/", views.OrderItemComplaintStorefrontView.as_view()),
    path("storefront/<str:token>/", views.OrderDetailStorefrontView.as_view()),
    path("storefront/<str:token>/items/", views.OrderItemsListStorefrontView.as_view()),
]
