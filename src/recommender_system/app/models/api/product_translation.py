from models.api.base import ApiBaseModel


class ProductTranslation(ApiBaseModel):
    """
    This model represents product translation as an object that is sent from
    core to RS component via API.
    """

    id: int
    language_code: str
    title: str
    meta_title: str
    meta_description: str
    short_description: str
    description: str
    slug: str
