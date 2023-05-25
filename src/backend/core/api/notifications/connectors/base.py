from abc import ABC, abstractmethod


class NotificationConnector(ABC):
    def __init__(self, *args, **kwargs):
        pass

    @abstractmethod
    def send(self, *args, **kwargs):
        """
        Send notification
        """
        raise NotImplementedError
