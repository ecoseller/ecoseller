from django.core.management.base import BaseCommand
from product.models import Product, ProductVariant
from random import randrange
import functools


class Command(BaseCommand):
    help = "Creates dummy product data"

    def add_arguments(self, parser):
        pass

    def generate_12_random_numbers(self):
        numbers = []
        for x in range(12):
            numbers.append(randrange(10))
        return numbers

    def calculate_checksum(self, ean):
        """
        Calculates the checksum for an EAN13
        @param list ean: List of 12 numbers for first part of EAN13
        :returns: The checksum for `ean`.
        :rtype: Integer
        """
        assert len(ean) == 12, "EAN must be a list of 12 numbers"

        def sum_(x, y):
            return int(x) + int(y)

        evensum = functools.reduce(sum_, ean[::2])
        oddsum = functools.reduce(sum_, ean[1::2])
        return (10 - ((evensum + oddsum * 3) % 10)) % 10

    def generate_ean(self):
        ean = self.generate_12_random_numbers()
        ean.append(self.calculate_checksum(ean))
        return "".join(map(str, ean))

    def handle(self, *args, **options):
        products = [
            {
                "id": 1,
                "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                "price": 109.95,
                "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
                "category": "men's clothing",
                "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                "variants": [
                    {"sku": "FJA-1", "ean": f"{self.generate_ean()}", "weight": 500},
                    {"sku": "FJA-2", "ean": f"{self.generate_ean()}", "weight": 500},
                    {"sku": "FJA-3", "ean": f"{self.generate_ean()}", "weight": 500},
                ],
            },
            {
                "id": 2,
                "title": "Mens Casual Premium Slim Fit T-Shirts ",
                "price": 22.3,
                "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
                "category": "men's clothing",
                "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
                "variants": [
                    {"sku": "TSH-1", "ean": f"{self.generate_ean()}", "weight": 150},
                    {"sku": "TSH-2", "ean": f"{self.generate_ean()}", "weight": 150},
                    {"sku": "TSH-3", "ean": f"{self.generate_ean()}", "weight": 150},
                ],
            },
            {
                "id": 3,
                "title": "Mens Cotton Jacket",
                "price": 55.99,
                "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
                "category": "men's clothing",
                "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
                "variants": [
                    {"sku": "JCK-1", "ean": f"{self.generate_ean()}", "weight": 700},
                    {"sku": "JCK-2", "ean": f"{self.generate_ean()}", "weight": 700},
                    {"sku": "JCK-3", "ean": f"{self.generate_ean()}", "weight": 700},
                ],
            },
        ]
        for product in products:
            p = Product.objects.create(
                id=product["id"],
                title=product["title"],
                description=product["description"],
            )
            p.save()
            for variant in product["variants"]:
                v = ProductVariant.objects.create(
                    sku=variant["sku"],
                    ean=variant["ean"],
                    weight=variant["weight"],
                )
                v.save()
                p.product_variants.add(v)
                p.save()
