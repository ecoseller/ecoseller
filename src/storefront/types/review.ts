export interface IItem {
    product_variant_name: string;
    product_id: number;
    product_variant_sku: string;
}

export interface IReview {
    comment: string;
    create_at: string;
    order: string;
    product: string;
    product_variant: string;
    rating: number;
    token: string;
}