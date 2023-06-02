from cart.models import (
    PaymentMethod,
    Cart,
)
from order.models import (
    Order,
)
from .conf import PaymentStatus
from django.conf import settings
from typing import Dict, List
import json


class PaymentResolver:
    config: Dict[str, List[Dict[str, str]]] = None
    price = None
    payment_method = None
    payment_status = None
    payment_id = None

    def __init__(self, order: Order):
        self.order = order

        config = self._load_config()
        self._validate_config(config)

    def _load_config(self):
        try:
            _config = json.load(open(settings.PAYMENT_CONFIG_PATH, "r"))
            return _config
        except FileNotFoundError:
            raise FileNotFoundError(
                f"Payment config file not found: {settings.PAYMENT_CONFIG_PATH}"
            )

    def _validate_config(self, config):
        """
        Validate payment method config
        """

        # iterate over keys in config
        for key in config:
            # check if there's implementation key and if it's callable
            if "implementation" not in config[key]:
                raise KeyError(f"Missing implementation key in {key} payment method")
