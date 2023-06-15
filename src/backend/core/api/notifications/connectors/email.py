from .base import NotificationConnector


class EmailConnector(NotificationConnector):
    @classmethod
    def send(self, *args, **kwargs):
        """
        Send Email notification
        """
        data = kwargs.get("data", None)
        _method = getattr(self, kwargs["method"])
        if data:
            _method(data=data)
        else:
            _method()

    @classmethod
    def send_order_confirmation(self, *args, **kwargs):
        """
        Call Email service
        """

        # import it here to avoid error on not initialized django app
        from emails.email.order import EmailOrderConfirmation
        from order.models import Order

        # obtain serialized order data from kwargs (data is a dict)
        data = kwargs.get("data", None)

        if not data:
            return False

        order_token = data.get("order_token", None)

        try:
            order = Order.objects.get(pk=order_token)
        except Order.DoesNotExist:
            return False
        customer_email = order.customer_email
        email = EmailOrderConfirmation(order, [customer_email], use_rq=True)

        email.send()

        return True