export interface OrderItem {
    tourId: number,
    tourName: string,
    price: Price,
    quantity: number
}
export interface Price {
    cost: number;
    currency: Currency;
}
export enum Currency {
    RSD = 0,
    EUR = 1,
    USD = 2
}