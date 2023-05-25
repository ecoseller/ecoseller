from .base import NotificationConnector
import requests


class RecommenderSystemConnector(NotificationConnector):
    @classmethod
    def send(self, *args, **kwargs):
        # import RecommenderSystemApi here to avoid error (RS_URL not defined) when importing this file
        # in the `conf.py` file
        from api.recommender_system import RecommenderSystemApi

        """
        Send Recommender API notification
        """
        data = kwargs.get("data", None)
        _method = getattr(RecommenderSystemApi, kwargs["method"])
        if data:
            _method(data=data)
        else:
            _method()
