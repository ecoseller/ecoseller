"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

from api.notifications.api import NotificationsAPI

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-^2x#dix3t(vd1yt7bdqmhs-*=tf%)td#yxuw6s$pun(#!z=c$@"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG", 1)

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(" ")

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "cms.apps.CmsConfig",
    "cart.apps.CartConfig",
    "category.apps.CategoryConfig",
    "country.apps.CountryConfig",
    "order.apps.OrderConfig",
    "product.apps.ProductConfig",
    "review.apps.ReviewConfig",
    "user.apps.UserConfig",
    "roles.apps.RolesConfig",
    "rest_framework_simplejwt",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "django_rq",
    "drf_yasg",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3030",
    "http://localhost:3000",
    "http://localhost:3031",
    "http://dashboard:3030",
    "http://storefront:3031",
]

CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.media",
            ],
        },
    },
]
WSGI_APPLICATION = "core.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    # "default": {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": BASE_DIR / "db.sqlite3",
    # }
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.environ.get("POSTGRES_DB", "ecoseller"),
        "USER": os.environ.get("POSTGRES_USER", "postgres"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "postgres"),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5433"),
    }
}
print(DATABASES)

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "user.authentication.UserAuthBackend",
]

# REST framework configuration

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# JWT configuration

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_HEADER_TYPES": ("JWT",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "email",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en"
PARLER_DEFAULT_LANGUAGE_CODE = "en"
LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]
PARLER_LANGUAGES = {
    None: (
        {
            "code": "en",
        },
        {
            "code": "cs",
        },
    ),
    "default": {
        "fallbacks": ["en"],  # defaults to PARLER_DEFAULT_LANGUAGE_CODE
        "hide_untranslated": False,  # the default; let .active_translations() return fallbacks too.
    },
}

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "static/"
STOREFRONT_URL = os.environ.get("STOREFRONT_URL", "http://localhost:3031")

# Directory where uploaded files will be stored
# this is only for development purposes, in production S3 or similar should be used
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), "mediafiles")
MEDIA_URL = "/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "user.User"

RS_URL = os.environ.get("RS_URL", "")
RS_ENABLED = os.environ.get("RS_ENABLED", "TRUE").upper() == "TRUE"

# Notifications API
NOTIFICATIONS_CONFIG_PATH = os.environ.get(
    "NOTIFICATIONS_CONFIG_PATH", "./config/notifications.json"
)
try:
    NOTIFICATIONS_API = NotificationsAPI()
except Exception as e:
    print(e)
    NOTIFICATIONS_API = None

# Online payment method APIs
PAYMENT_CONFIG_PATH = os.environ.get("PAYMENT_CONFIG_PATH", "./config/payments.json")
try:
    PAYMENT_METHOD_APIS = None
except Exception as e:
    print(e)
    PAYMENT_METHOD_APIS = None

# Redis queue
USING_REDIS_QUEUE = bool(int(os.environ.get("USING_REDIS_QUEUE", 0)))
if USING_REDIS_QUEUE:
    RQ_QUEUES = {
        "default": {
            "HOST": os.environ.get("REDIS_QUEUE_LOCATION", "redis"),
            "PORT": 6379,
            "DB": 0,
            "PASSWORD": os.environ.get("REDIS_PASSWORD", ""),
            "DEFAULT_TIMEOUT": 500,
        },
        "high": {
            "HOST": os.environ.get("REDIS_QUEUE_LOCATION", "redis"),
            "PORT": 6379,
            "DB": 0,
            "PASSWORD": os.environ.get("REDIS_PASSWORD", ""),
            "DEFAULT_TIMEOUT": 500,
        },
        "low": {
            "HOST": os.environ.get("REDIS_QUEUE_LOCATION", "redis"),
            "PORT": 6379,
            "DB": 0,
            "PASSWORD": os.environ.get("REDIS_PASSWORD", ""),
            "DEFAULT_TIMEOUT": 360,
        },
    }

# Email configuration
EMAIL_USE_SSL = bool(int(os.environ.get("EMAIL_USE_SSL", 0)))
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 465))
EMAIL_HOST = os.environ.get("EMAIL_HOST", None)
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", None)
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", None)
EMAIL_FROM = os.environ.get("EMAIL_FROM", None)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

USE_ELASTIC = bool(int(os.environ.get("USE_ELASTIC", "0")))
print("USE_ELASTIC", USE_ELASTIC, os.environ.get("USE_ELASTIC"))
ELASTIC_AUTO_REBUILD_INDEX = bool(
    int(os.environ.get("ELASTIC_AUTO_REBUILD_INDEX", "0"))
)

if USE_ELASTIC:
    ELASTICSEARCH_INDEX_NAMES = {
        "product.documents.product": "product",
    }
    ELASTICSEARCH_DSL = {
        "default": {
            "hosts": os.environ.get("ELASTIC_HOST", "elastic:9200"),
        },
    }
    if os.environ.get("ELASTICSEARCH_USERNAME") and os.environ.get(
        "ELASTICSEARCH_PASSWORD"
    ):
        ELASTICSEARCH_DSL["default"]["http_auth"] = (
            os.environ.get("ELASTICSEARCH_USERNAME")
            + ":"
            + os.environ.get("ELASTICSEARCH_PASSWORD")
        )
    INSTALLED_APPS += [
        "django_elasticsearch_dsl",
        "django_elasticsearch_dsl_drf",
        "search.apps.SearchConfig",
    ]
