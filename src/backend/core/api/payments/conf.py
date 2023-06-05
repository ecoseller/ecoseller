from enum import Enum


class PaymentStatus(Enum):
    PENDING = "pending"  # payment is initiated, but not yet confirmed
    PAID = "paid"  # payment is confirmed
    FAILED = "failed"  # payment failed
    CANCELLED = "cancelled"  # payment was cancelled by user (this is not the same as failed and some payment methods don't support this status)
