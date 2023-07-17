from django.conf import settings
from typing import Dict, List
from .conf import (
    EventTypes,
    NotificationTypes,
    NOTIFICATION_TYPE_REQUIRED_FIELDS,
    NOTIFICATION_TYPE_CONNECTORS,
)
import json


class NotificationsAPI:
    config: Dict[str, List[Dict[str, str]]] = None

    def __init__(self):
        _config = self._load_config()
        self.config = self._parse_config(_config)

    def _load_config(self):
        try:
            _config = json.load(open(settings.NOTIFICATIONS_CONFIG_PATH, "r"))
            return _config
        except FileNotFoundError:
            raise FileNotFoundError(
                f"Notifications config file not found: {settings.NOTIFICATIONS_CONFIG_PATH}"
            )

    def _validate_event(self, event):
        """
        Validate event type and return a new event config with types from EventTypes enum
        """
        if event not in EventTypes._value2member_map_:
            raise ValueError(f"Invalid event type: {event}")
        return EventTypes(event)

    def _check_connector_presence(self, notification):
        """
        Check if connector is present in config
        """
        if notification["type"] not in NOTIFICATION_TYPE_CONNECTORS:
            raise ValueError(
                f"Connector for notification type '{notification['type']}' not present in config"
            )

    def _validate_notification(self, notification):
        """
        Validate notification type and return a new notification config with types from NotificationTypes enum
        """
        if notification["type"] not in NotificationTypes._value2member_map_:
            raise ValueError(f"Invalid notification type: {notification['type']}")
        _notification = {"type": NotificationTypes(notification["type"])}
        # check if required fields are present
        for _required_field in NOTIFICATION_TYPE_REQUIRED_FIELDS[
            NotificationTypes(notification["type"])
        ]:
            if _required_field not in notification:
                raise ValueError(
                    f"Required field '{_required_field}' not present in notification config for type '{notification['type']}'"
                )
            _notification[_required_field] = notification[_required_field]
        return _notification

    def _parse_config(self, config):
        """
        Parse input config and return a new config with fields from EventTypes and NotificationTypes
        """
        _config = {}
        for _event in config:
            t_event = self._validate_event(_event)
            # check if notification type is valid
            _config[t_event] = []
            for _notification in config[_event]:
                t_notification = self._validate_notification(_notification)
                # check if connector is present in config
                self._check_connector_presence(t_notification)
                _config[t_event].append(t_notification)
        return _config

    def __call__(self, *args, **kwargs):
        print("Notifications API called")
        print(self.config)

    def notify(self, event: EventTypes, **kwargs):
        """
        Notify users about an event
        """
        exceptions = []
        if event not in self.config:
            raise ValueError(f"Event type '{event}' not present in config")
        for _notification in self.config[event]:
            try:
                # obtain notification connector from config and call it
                _connector = NOTIFICATION_TYPE_CONNECTORS[_notification["type"]]
                _connector.send(**_notification, **kwargs)
            except Exception as e:
                exceptions.append(e)
        if len(exceptions) > 0:
            raise Exception(";".join(str(exceptions)))
