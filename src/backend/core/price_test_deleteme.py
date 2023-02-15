from product.models import ProductPrice, ProductVariant
iphone_256gb=ProductVariant.objects.get(sku='MQ533YC/A')
iphone_128gb=ProductVariant.objects.get(sku='MQ4X3YC/A')

price_256gb_czk = ProductPrice.objects.get(price_list__code='CZK_maloobchod', product_variant=iphone_256gb)
price_256gb_czk.formatted_price # '31990 Kč'
