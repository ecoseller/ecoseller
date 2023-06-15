from enum import Enum


class PaymentStatus(Enum):
    PENDING = "PENDING"  # payment is initiated, but not yet confirmed
    PAID = "PAID"  # payment is confirmed
    FAILED = "FAILED"  # payment failed
    CANCELLED = "CANCELLED"  # payment was cancelled by user (this is not the same as failed and some payment methods don't support this status)
