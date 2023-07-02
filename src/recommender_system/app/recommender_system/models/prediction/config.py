from typing import List

from pydantic import BaseModel


class EASEConfig(BaseModel):
    l2_options: List[float] = [1, 10, 100]
