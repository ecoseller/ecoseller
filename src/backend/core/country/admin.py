from django.contrib import admin
from .models import (
    Country,
    Currency,
)
# from django.contrib import admin

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "locale", "default_price_list", "update_at", "create_at")
    list_filter = ("update_at", "create_at")
    search_fields = ("code", "name", "locale")    

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("code", "symbol", "symbol_position", "update_at", "create_at")
    list_filter = ("update_at", "create_at")
    search_fields = ("code", "symbol", "symbol_position")