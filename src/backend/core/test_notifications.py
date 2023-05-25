from django.conf import settings

NotificationsApi = settings.NOTIFICATIONS_API

from api.notifications.conf import (
    EventTypes,
    NotificationTypes,
    NOTIFICATION_TYPE_REQUIRED_FIELDS,
)


NotificationsApi.notify(
    event=EventTypes.PRODUCT_SAVE,
    data={"product_id": 1, "product_name": "Product 1"},
)
