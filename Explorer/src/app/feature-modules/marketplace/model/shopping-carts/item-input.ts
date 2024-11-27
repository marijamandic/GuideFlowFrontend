import { ProductType } from "../product-type";

export interface ItemInput {
	type: ProductType;
	productId: number;
	productName: string;
	adventureCoin: number;
}
