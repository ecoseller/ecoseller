from pydantic import BaseModel


class ProductTranslation(BaseModel):
    """
    This model represents product's translation as an object that is sent from
    core to RS component via API.
    """

    language_code: str
    title: str
    meta_title: str
    meta_description: str
    short_description: str
    description: str
    slug: str
