from django.utils.translation import gettext as _
from django.utils import translation

from .base import Email


class EmailOrderConfirmation(Email):
    template_path = "email/order/confirmation.html"

    def __init__(self, order, recipient_list=[], use_rq=False):
        self.order = order
        self.recipient_list = recipient_list
        self.language = order.cart.country.locale
        self.use_rq = use_rq
        self.meta = {
            "order": self.order.pk,
            "type": "order_confirmation",
            "language": self.language,
            "recipient_list": self.recipient_list,
        }

    def generate_subject(self):
        translation.activate(self.language)
        print(self.language)
        self.subject = _("Order confirmation")

    def generate_context(self):
        self.context = {
            "internal_code": self.order.pk,
            "date": self.order.create_at.strftime("%d. %m. %Y"),
            "order": self.order,
        }
