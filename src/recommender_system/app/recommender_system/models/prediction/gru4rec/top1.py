import torch


class Top1(torch.nn.Module):
    def forward(self, output: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        return torch.sum()
