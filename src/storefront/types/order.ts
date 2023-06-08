export enum OrderStatus {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Shipped = "SHIPPED",
    Cancelled = "CANCELLED",
}

export interface IOrder {
    token: string;
    create_at: string;
    status: OrderStatus;
    items: string[];
}
