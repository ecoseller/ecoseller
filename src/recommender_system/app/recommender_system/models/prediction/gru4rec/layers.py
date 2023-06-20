from typing import List, Optional, Tuple

import torch


class ReducedLinearEmbedding(torch.nn.Linear):
    indices: Optional[torch.Tensor] = None

    def forward(self, input: torch.Tensor) -> torch.Tensor:
        reduced_input = input
        weight = self.weight
        if self.indices is not None:
            reduced_input = input[:, self.indices]
            weight = self.weight[:, self.indices]

        result = torch.matmul(reduced_input, weight.T)
        if self.bias is not None:
            result += self.bias

        return result


class ReducedLinearFeedforward(torch.nn.Linear):
    indices: Optional[List[int]] = None

    def forward(self, input: torch.Tensor) -> torch.Tensor:
        weight = self.weight
        bias = self.bias
        if self.indices is not None:
            weight = self.weight[self.indices]
            if self.bias is not None:
                bias = self.bias[self.indices]

        result = torch.matmul(input, weight.T)
        if bias is not None:
            result += bias

        return result


class SelectGRUOutput(torch.nn.Module):
    def forward(self, inputs: Tuple[torch.Tensor, ...]) -> torch.Tensor:
        return inputs[-1]
