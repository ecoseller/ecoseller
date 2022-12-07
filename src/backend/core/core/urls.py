from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

router = routers.DefaultRouter()


urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("cart/", include("cart.urls")),
    path("category/", include("category.urls")),
    path("cms/", include("cms.urls")),
    path("order/", include("order.urls")),
    path("product/", include("product.urls")),
    path("review/", include("review.urls")),
    path("user/", include("user.urls")),
]
