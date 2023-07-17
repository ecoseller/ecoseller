from enum import Enum

from api.notifications.connectors.email import EmailConnector
from api.notifications.connectors.http import HttpConnector
from api.notifications.connectors.recommender import RecommenderSystemConnector


class EventTypes(Enum):
    PRODUCT_SAVE = "PRODUCT_SAVE"
    PRODUCT_UPDATE = "PRODUCT_UPDATE"
    PRODUCT_DELETE = "PRODUCT_DELETE"
    PRODUCTVARIANT_SAVE = "PRODUCTVARIANT_SAVE"
    PRODUCTVARIANT_UPDATE = "PRODUCTVARIANT_UPDATE"
    PRODUCTVARIANT_DELETE = "PRODUCTVARIANT_DELETE"
    CATEGORY_SAVE = "CATEGORY_SAVE"
    CATEGORY_UPDATE = "CATEGORY_UPDATE"
    CATEGORY_DELETE = "CATEGORY_DELETE"
    ORDER_SAVE = "ORDER_SAVE"
    ORDER_UPDATE = "ORDER_UPDATE"
    ORDER_DELETE = "ORDER_DELETE"
    REVIEW_SEND = "REVIEW_SEND"
    ORDER_ITEM_COMPLAINT_CREATED = "ORDER_ITEM_COMPLAINT_CREATED"
    ORDER_ITEM_COMPLAINT_UPDATED = "ORDER_ITEM_COMPLAINT_UPDATED"
    PRODUCT_DETAIL_ENTER = "PRODUCT_DETAIL_ENTER"
    PRODUCT_DETAIL_LEAVE = "PRODUCT_DETAIL_LEAVE"
    PRODUCT_ADD_TO_CART = "PRODUCT_ADD_TO_CART"
    RECOMMENDATION_VIEW = "RECOMMENDATION_VIEW"


class NotificationTypes(Enum):
    HTTP = "HTTP"
    EMAIL = "EMAIL"
    RECOMMENDERAPI = "RECOMMENDERAPI"


NOTIFICATION_TYPE_REQUIRED_FIELDS = {
    NotificationTypes.HTTP: ["url", "method"],
    NotificationTypes.EMAIL: ["method"],
    NotificationTypes.RECOMMENDERAPI: ["method"],
}

NOTIFICATION_TYPE_CONNECTORS = {
    NotificationTypes.HTTP: HttpConnector,
    NotificationTypes.RECOMMENDERAPI: RecommenderSystemConnector,
    NotificationTypes.EMAIL: EmailConnector,
}
