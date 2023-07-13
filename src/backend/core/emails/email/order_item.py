from django.conf import settings
from django.utils import translation
from django.utils.translation import gettext as _

from order.models import OrderItemComplaintType, OrderItemComplaintStatus
from .base import Email


class OrderItemComplaintConfirmationEmail(Email):
    template_path = "email/generic_email.html"

    def __init__(self, complaint, recipient_list, use_rq=False):
        self.complaint = complaint
        self.language = complaint.order.cart.country.locale
        self.recipient_list = recipient_list
        self.use_rq = use_rq
        self.meta = {
            "complaint": self.complaint.id,
            "type": "order_item_complaint_confirmation",
            "language": self.language,
            "recipient_list": self.recipient_list,
        }

    def generate_subject(self):
        translation.activate(self.language)
        self.subject = _("Order item complaint confirmation")

    def generate_context(self):
        translation.activate(self.language)
        storefront_url = settings.STOREFRONT_URL

        body_text = _(
            "you created the following item warranty claim") if self.complaint.type == OrderItemComplaintType.WARRANTY_CLAIM else _(
            "you created the following item return request")

        self.context = {
            "main_title": _("Order item complaint confirmation"),
            "subtitle": _("Hello,"),
            "body": f"{body_text}<br/>{self.complaint.cart_item.product_variant_name}",
            "button_title": _("Order detail"),
            "button_link": f"{storefront_url}/review/{self.complaint.order.token}",
        }


class OrderItemComplaintStatusUpdateEmail(Email):
    template_path = "email/generic_email.html"

    def __init__(self, complaint, recipient_list, use_rq=False):
        self.complaint = complaint
        self.language = complaint.order.cart.country.locale
        self.recipient_list = recipient_list
        self.use_rq = use_rq
        self.meta = {
            "complaint": self.complaint.id,
            "type": "order_item_status_update",
            "language": self.language,
            "recipient_list": self.recipient_list,
        }

    def generate_subject(self):
        translation.activate(self.language)
        self.subject = _(
            "Warranty claim status update") if self.complaint.type == OrderItemComplaintType.WARRANTY_CLAIM else _(
            "Return request status update")

    def generate_context(self):
        translation.activate(self.language)
        storefront_url = settings.STOREFRONT_URL

        body_text = _(
            "The status of item's warranty claim has been updated") if self.complaint.type == OrderItemComplaintType.WARRANTY_CLAIM else _(
            "The status of item's return request has been updated")
        new_status = _("Status: APPROVED") if self.complaint.status == OrderItemComplaintStatus.APPROVED else _(
            "Status: DECLINED") if self.complaint.status == OrderItemComplaintStatus.DECLINED else _("Status: CREATED")

        self.context = {
            "main_title": _("Order item complaint status update"),
            "subtitle": _("Hello,"),
            "body": f"{body_text}<br/>{self.complaint.cart_item.product_variant_name}<br/>{new_status}",
            "button_title": _("Order detail"),
            "button_link": f"{storefront_url}/review/{self.complaint.order.token}",
        }
