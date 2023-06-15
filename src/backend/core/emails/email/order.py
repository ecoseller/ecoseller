from django.utils import translation
from django.utils.translation import gettext as _

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
        translation.activate(self.language)

        shipping_info = self.order.cart.shipping_info
        billing_info = self.order.cart.billing_info
        shipping_method = self.order.cart.shipping_method_country
        payment_method = self.order.cart.payment_method_country

        self.context = {
            "internal_code": self.order.pk,
            "date": self.order.create_at.strftime("%d. %m. %Y"),
            "order": self.order,
            "shipping_info": {
                "name": f"{shipping_info.first_name} {shipping_info.surname}",
                "street": shipping_info.street,
                "city": shipping_info.city,
                "postal_code": shipping_info.postal_code,
                "country": shipping_info.country.name,
            },
            "contact": {
                "name": f"{shipping_info.first_name} {shipping_info.surname}",
                "email": shipping_info.email,
                "phone": shipping_info.phone,
            },
            "billing_info": {
                "name": f"{billing_info.first_name} {billing_info.surname}",
                "company": billing_info.company_name,
                "company_identification_number": billing_info.company_id,
                "company_vat_number": billing_info.vat_number,
                "street": billing_info.street,
                "city": billing_info.city,
                "postal_code": billing_info.postal_code,
                "country": billing_info.country.name,
            },
            "shipping_method": {
                "title": shipping_method.shipping_method.safe_translation_getter(
                    "title", language_code=self.language
                ),
            },
            "payment_method": {
                "title": payment_method.payment_method.safe_translation_getter(
                    "title", language_code=self.language
                ),
            },
            "products": [
                {
                    "title": item.product.safe_translation_getter(
                        "title", language_code=self.language
                    ),
                    "sku": item.product_variant.sku,
                    "quantity": item.quantity,
                    "attributes": ", ".join(
                        [
                            f"{attribute.safe_translation_getter('name', language_code=self.language)}"
                            for attribute in item.product_variant.attributes.all()
                        ]
                    ),
                    "base_price": item.total_price_without_vat_before_discount_formatted,
                    "is_discounted": item.discount and item.discount > 0,
                    "discount_price": item.total_price_without_vat_formatted,
                }
                for item in self.order.cart.cart_items.all()
            ],
            "currency": self.order.cart.pricelist.currency,
            "price_products_incl_vat": self.order.cart.total_items_price_without_vat_formatted,
            "price_shipping_payment_incl_vat": self.order.cart.pricelist.format_price(
                self.order.cart.price_payment_incl_vat
                + self.order.cart.price_shipping_incl_vat
            ),
            "price_total_incl_vat": self.order.cart.total_price_without_vat_formatted,
        }
