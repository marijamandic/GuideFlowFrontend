import { OrderItem } from "./orderItem.model";

export interface ShoppingCart {
    id: number,
    items: OrderItem[]
    TouristId: number,
    totalPrice: number
}