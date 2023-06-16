from order.models import Order
from order.serializers import (
    OrderDetailSerializer,
)
from django.conf import settings

from api.notifications.conf import (
    EventTypes,
)

NotificationsApi = settings.NOTIFICATIONS_API

order = Order.objects.get(pk="e2024c20d479432c97bbe85f6ac10597")

NotificationsApi.notify(
    event=EventTypes.ORDER_SAVE,
    data={
        "order_token": str(order.token),
        "customer_email": order.customer_email,
        "order": OrderDetailSerializer(order).data,
    },
)
