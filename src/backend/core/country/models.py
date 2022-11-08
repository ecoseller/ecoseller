from django.db import models

class Country(models.Model):
    """
    Country model used for front-end translations, shipping costs and product price lists.
    """
    code = models.CharField(primary_key=True, max_length=2, unique=True)
    name = models.CharField(max_length=200, blank=False)
    locale = models.CharField(max_length=2, blank=False)
    update_at=models.DateTimeField(auto_now=True)
    create_at=models.DateTimeField(auto_now_add=True)