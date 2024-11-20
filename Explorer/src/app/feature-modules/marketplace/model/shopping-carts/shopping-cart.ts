import { SingleItem } from './single-item';

export interface ShoppingCart {
	id: number;
	touristId: number;
	singleItems: SingleItem[];
}
