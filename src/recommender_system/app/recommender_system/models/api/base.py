from pydantic import BaseModel


class ApiBaseModel(BaseModel):
    def dict(self, *args, **kwargs):
        if "exclude_none" not in kwargs:
            kwargs["exclude_none"] = True
        return super().dict(*args, **kwargs)
