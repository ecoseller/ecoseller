from typing import Tuple

import torch


class SelectGRUOutput(torch.nn.Module):
    def forward(self, inputs: Tuple[torch.Tensor, ...]) -> torch.Tensor:
        return inputs[-1]
