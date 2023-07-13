import datetime

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

    @classmethod
    def send_review_request(self, *args, **kwargs):
        """
        Call Email service
        """

        # import it here to avoid error on not initialized django app
        from emails.email.review import EmailOrderReview
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
        email = EmailOrderReview(order, [customer_email], use_rq=True)

        email.send_at(datetime.timedelta(days=7))

        return True

    @classmethod
    def send_order_complaint_confirmation(self, *args, **kwargs):
        """
        Send order item complaint confirmation email to the user
        """

        # import it here to avoid error on not initialized django app
        from emails.email.order_item_complaint import OrderItemComplaintConfirmationEmail
        from order.models import OrderItemComplaint

        # obtain serialized order data from kwargs (data is a dict)
        data = kwargs.get("data", None)

        if not data:
            return False

        complaint_id = data.get("complaint_id", None)

        try:
            complaint = OrderItemComplaint.objects.get(pk=complaint_id)

            customer_email = complaint.order.customer_email
            email = OrderItemComplaintConfirmationEmail(complaint, [customer_email], use_rq=True)

            email.send()

            return True
        except OrderItemComplaint.DoesNotExist:
            return False
