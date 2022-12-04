from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from cart.models import Cart

class Profile(AbstractBaseUser):
    email = models.EmailField(max_length=40, unique=True)
    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)



    cart = models.ForeignKey(Cart, null=True, on_delete=models.SET_NULL)
    permission_role = models.ForeignKey("PermissionRole")

    USERNAME_FIELD = 'email'
    EMAIL_FIEL = 'email'
    REQUIRED_FIELDS = ['email']


    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.first_name

class Permission(models.Model):
    permission = models.CharField(max_length=200, unique=True)
    permission_level = models.IntegerField(default=1, required=True)

class PermissionRole(models.Model):
    role = models.CharField(max_length=200, unique=True)
    permissions = models.ManyToManyField(Permission)
