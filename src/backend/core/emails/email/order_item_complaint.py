from django.conf import settings
from django.utils import translation
from django.utils.translation import gettext as _

from order.models import OrderItemComplaintType
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
            "body": f"{body_text}\n{self.complaint.cart_item.product_variant_name}",
            "button_title": _("Order detail"),
            "button_link": f"{storefront_url}/review/{self.complaint.order.token}",
        }
