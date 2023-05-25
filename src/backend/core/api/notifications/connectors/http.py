from .base import NotificationConnector
import requests


class HttpConnector(NotificationConnector):
    @classmethod
    def send(self, *args, **kwargs):
        """
        Send HTTP notification
        """
        headers = kwargs.get("headers", None)
        data = kwargs.get("data", None)
        _ = requests.request(
            method=kwargs["method"], url=kwargs["url"], json=data, headers=headers
        )
