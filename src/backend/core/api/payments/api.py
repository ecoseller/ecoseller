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
import importlib
from .modules.BasePaymentMethod import (
    BasePaymentMethod,
    PayBySquareMethod,
    OnlinePaymentMethod,
)


class PaymentResolver:
    config: Dict[str, List[Dict[str, str]]] = None
    price = None
    payment_method = None
    payment_status = None
    payment_id = None

    def __init__(self, order: Order):
        self.order = order

        config = self._load_config()
        self.config = self._validate_config(config)

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

            # obtain module and class name from implementation key
            implementation = config[key]["implementation"].rsplit(".", 1)
            module, class_name = implementation[0], implementation[1]
            # load the module, will raise ImportError if module cannot be loaded
            m = importlib.import_module(module)
            # get the class, will raise AttributeError if class cannot be found
            c = getattr(m, class_name)
            # check if the class is callable
            if not callable(c):
                raise ValueError(
                    f"Implementation for {key} payment method is not callable"
                )
            # check if the class is a subclass of BasePaymentMethod
            if not issubclass(c, BasePaymentMethod):
                raise ValueError(
                    f"Implementation for {key} payment method is not a subclass of BasePaymentMethod"
                )

            config[key]["implementation"] = c

        return config

    def _get_payment_method_from_config(self):
        """
        Get payment method country from order
        """
        if not self.order:
            raise ValueError("Order not set")

        payment_method = self.order.cart.payment_method_country
        api_id = payment_method.api_request
        try:
            return self.config[api_id]
        except KeyError:
            raise KeyError(f"Unknown payment method: {api_id}")

    def pay(self):
        """
        Initiate payment
        """
        # get payment method api
        payment_config = self._get_payment_method_from_config()
        # get implementation
        implementation = payment_config["implementation"]
        # instantiate implementation with order and kwargs
        api = implementation(
            order=self.order,
            **payment_config["kwargs"],
        )
        # call pay method
        data = api.pay()

        # if api is type PayBySquare, then we need to return the QR code as well as all
        if issubclass(implementation, PayBySquareMethod):
            return {
                "qr_code": data["qr_code"],
                "payment_data": data["payment_data"],
                **data,
            }
        if issubclass(implementation, OnlinePaymentMethod):
            return {
                "payment_url": data["payment_url"],
                "payment_id": data["payment_id"],
                **data,
            }
        return data

    def status(self):
        """
        Get payment status
        """
        # get payment method api
        payment_config = self._get_payment_method_from_config()
        # get implementation
        implementation = payment_config["implementation"]
        # instantiate implementation with order and kwargs
        api = implementation(
            order=self.order,
            **payment_config["kwargs"],
        )
        # call status method
        status = api.status()
        # check if status is valid PaymentStatus
        if not isinstance(status, PaymentStatus):
            raise ValueError("Invalid payment status")
        # return status
        return status
