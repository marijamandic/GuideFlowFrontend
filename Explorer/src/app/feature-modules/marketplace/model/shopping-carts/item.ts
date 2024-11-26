import { ProductType } from "../product-type";

export interface Item {
	id: number;
	shoppingCartId: number;
	type: ProductType;
	productId: number;
	productName: string;
	adventureCoin: number;
}
