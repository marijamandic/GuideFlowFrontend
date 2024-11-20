export enum ProductType {
	Tour,
	Bundle
}

export interface Item {
	id: number;
	shoppingCartId: number;
	type: ProductType;
	productId: number;
	productName: string;
	adventureCoin: number;
}
