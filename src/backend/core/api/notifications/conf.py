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
    PRODUCTTYPE_SAVE = "PRODUCTTYPE_SAVE"
    PRODUCTTYPE_UPDATE = "PRODUCTTYPE_UPDATE"
    PRODUCTTYPE_DELETE = "PRODUCTTYPE_DELETE"
    PRICE_SAVE = "PRICE_SAVE"
    PRICE_UPDATE = "PRICE_UPDATE"
    PRICE_DELETE = "PRICE_DELETE"
    ATTRIBUTETYPE_SAVE = "ATTRIBUTETYPE_SAVE"
    ATTRIBUTETYPE_UPDATE = "ATTRIBUTETYPE_UPDATE"
    ATTRIBUTETYPE_DELETE = "ATTRIBUTETYPE_DELETE"
    ATTRIBUTE_SAVE = "ATTRIBUTE_SAVE"
    ATTRIBUTE_UPDATE = "ATTRIBUTE_UPDATE"
    ATTRIBUTE_DELETE = "ATTRIBUTE_DELETE"
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
    RECOMMENDER_CONFIG_SAVE = "RECOMMENDER_CONFIG_SAVE"
    RECOMMENDER_TRAINER_QUEUE_ITEM_SAVE = "RECOMMENDER_TRAINER_QUEUE_ITEM_SAVE"


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
