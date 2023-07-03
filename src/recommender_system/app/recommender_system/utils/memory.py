import os
import psutil
from typing import Tuple


def get_current_memory_usage() -> Tuple[float, float]:
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / (1024 * 1024), process.memory_percent()
