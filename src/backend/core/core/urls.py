from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()


urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("cart/", include("cart.urls")),
    path("category/", include("category.urls")),
    path("cms/", include("cms.urls")),
    path("email/", include("emails.urls")),
    path("order/", include("order.urls")),
    path("product/", include("product.urls")),
    path("review/", include("review.urls")),
    path("user/", include("user.urls")),
    path("roles/", include("roles.urls")),
    path("country/", include("country.urls")),
    path("editorjs/", include("cms.editorjs.urls")),
    path("django-rq/", include("django_rq.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
