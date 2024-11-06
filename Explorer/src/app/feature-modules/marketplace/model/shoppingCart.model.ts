import { OrderItem } from "./orderItem.model";

export interface ShoppingCart {
    id: number,
    items: OrderItem[]
    userId: number,
    totalPrice: number
}