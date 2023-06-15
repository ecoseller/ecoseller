from .base import NotificationConnector


class EmailConnector(NotificationConnector):
    @classmethod
    def send(self, *args, **kwargs):
        """
        Send Email notification
        """

        data = kwargs.get("data", None)
        try:
            _method = getattr(EmailConnector, kwargs["method"])
        except AttributeError:
            raise AttributeError(f"EmailConnector has no method {kwargs['method']}")
        print("Sending email...", data, _method)
        # TODO: in #285
