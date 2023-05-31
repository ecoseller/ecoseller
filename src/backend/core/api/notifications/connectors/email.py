from .base import NotificationConnector


class EmailConnector(NotificationConnector):
    @classmethod
    def send(self, *args, **kwargs):
        """
        Send Email notification
        """
        print("EmailConnector called")
        # TODO: implement after email service is ready
