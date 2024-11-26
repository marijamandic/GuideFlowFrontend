import { Item } from './item';

export interface ShoppingCart {
	id: number;
	touristId: number;
	items: Item[];
}
