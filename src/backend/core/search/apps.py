from django.apps import AppConfig
from django.conf import settings


class SearchConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "search"

    def ready(self):
        print("search is ready")
        if settings.USE_ELASTIC and settings.ELASTIC_AUTO_REBUILD_INDEX:
            # rebuild search index after server restart
            # but only if elastic is used and is currently running

            import os
            import time
            from django.core import management

            # rebuild search index
            try:
                management.call_command("search_index", "--rebuild", "-f")
            except:
                print("search index rebuild failed")
                pass
