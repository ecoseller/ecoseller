from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from cart.models import Cart


# Manager for User model
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not password:
            raise ValueError("Users must have a password")

        # check whether user already exists
        if User.objects.filter(email=email).exists():
            raise ValueError("User already exists")

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        if not email:
            raise ValueError("SuperUsers must have an email address")
        if not password:
            raise ValueError("SuperUsers must have a password")

        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
        )

        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user


# User model
class User(AbstractBaseUser):
    email = models.EmailField(max_length=40, primary_key=True)
    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    cart = models.ForeignKey(Cart, null=True, on_delete=models.SET_NULL)
    permission_role = models.ForeignKey(
        "PermissionRole", null=True, on_delete=models.SET_NULL
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    EMAIL_FIEL = "email"
    REQUIRED_FIELDS = []

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    def __str__(self):
        """
        Returns a string representation of this `User`.
        This string is used when a `User` is printed in the console.
        """
        return self.email


class Permission(models.Model):
    permission = models.CharField(max_length=200, unique=True)
    permission_level = models.IntegerField(default=1)


class PermissionRole(models.Model):
    role = models.CharField(max_length=200, unique=True)
    permissions = models.ManyToManyField(Permission)
