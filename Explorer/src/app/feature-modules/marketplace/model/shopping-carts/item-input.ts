import { ProductType } from './item';

export interface ItemInput {
	type: ProductType;
	productId: number;
	productName: string;
	adventureCoin: number;
}
