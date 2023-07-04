from enum import Enum


class DataLoaderType(Enum):
    INCREMENTAL = "INCREMENTAL"
    TRAIN = "TRAIN"
    TEST = "TEST"
    FULL = "FULL"
