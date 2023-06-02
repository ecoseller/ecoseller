from api.payments.api import PaymentResolver
from order.models import Order
from cart.models import (
    Cart,
    ShippingInfo,
    BillingInfo,
    ShippingMethodCountry,
    ShippingMethod,
    PaymentMethod,
    PaymentMethodCountry,
)
from country.models import Country
from product.models import PriceList

cz = Country.objects.get(code="cz")

shipping_method = ShippingMethodCountry.objects.filter(country=cz).first()

payment_method = PaymentMethodCountry.objects.filter(
    api_request="BANKTRANSFER_CZK", country=cz
).first()

# create test cart
cart = Cart.objects.create(
    country=cz,
    pricelist=PriceList.objects.get(code="CZK_maloobchod"),
    shipping_info=ShippingInfo.objects.all().first(),
    billing_info=BillingInfo.objects.all().first(),
    shipping_method_country=shipping_method,
    payment_method_country=payment_method,
)

# create test order
order = Order.objects.create(cart=cart)

# create payment resolver
p = PaymentResolver(order=order)

# initiate payment
pay = p.pay()
print(pay)

# get payment status
status = p.status()
print(status)

# change payment method to online payment
payment_method = PaymentMethodCountry.objects.filter(
    api_request="TEST_API", country=cz
).first()


# create test cart
cart = Cart.objects.create(
    country=cz,
    pricelist=PriceList.objects.get(code="CZK_maloobchod"),
    shipping_info=ShippingInfo.objects.all().first(),
    billing_info=BillingInfo.objects.all().first(),
    shipping_method_country=shipping_method,
    payment_method_country=payment_method,
)

# create test order
order = Order.objects.create(cart=cart)

# create payment resolver
p = PaymentResolver(order=order)

# initiate payment
pay = p.pay()
print(pay)

# get payment status
status = p.status()
print(status)
