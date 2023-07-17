from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework import routers

router = routers.DefaultRouter()

schema_view = get_schema_view(
    openapi.Info(
        title="Ecoseller Core API",
        default_version="v1",
        description="Ecoseller Core API OpenAPI description",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

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
    path("search/", include("search.urls")),
    path("recommender/", include("recommender.urls")),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),  # OpenAPI paths
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
