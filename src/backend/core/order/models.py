import uuid

from django.db import models
from enumchoicefield import ChoiceEnum, EnumChoiceField

from api.recommender_system import RecommenderSystemApi
from cart.models import Cart


class OrderStatus(ChoiceEnum):
    """
    Enum class for order status.
    """

    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    CANCELLED = "CANCELLED"


class Order(models.Model):
    """
    Object representing order of user.
    """

    token = models.UUIDField(primary_key=True, default=uuid.uuid4)
    create_at = models.DateTimeField(auto_now_add=True)
    status = EnumChoiceField(enum_class=OrderStatus, default=OrderStatus.PENDING)
    cart = models.ForeignKey(
        Cart, null=True, on_delete=models.SET_NULL, related_name="order"
    )
    marketing_flag = models.BooleanField(default=False)
    agreed_to_terms = models.BooleanField(default=False)
    payment_id = models.CharField(
        max_length=100, null=True, help_text="Payment ID from payment gateway or bank"
    )

    @property
    def customer_email(self):
        return self.cart.shipping_info.email

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields,
        )
        # TODO: Save only if status is finished, get session_id?
        data = {
            "_model_class": self.__class__.__name__,
            "token": self.token,
            "create_at": self.create_at.isoformat(),
            "session_id": "session",
            "product_variants": [
                (item.product_variant.sku, item.quantity)
                for item in self.cart.cart_items.all()
            ],
        }
        RecommenderSystemApi.store_object(data=data)
