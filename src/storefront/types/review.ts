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

export const labels: { [index: string]: string } = {
    10: 'Useless',
    20: 'Useless+',
    30: 'Poor',
    40: 'Poor+',
    50: 'Ok',
    60: 'Ok+',
    70: 'Good',
    80: 'Good+',
    90: 'Excellent',
    100: 'Excellent+',
};

export function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}