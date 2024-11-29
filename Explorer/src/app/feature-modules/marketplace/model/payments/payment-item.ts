import { ProductType } from "../product-type";

export interface PaymentItem {
	id: number;
	paymentId: number;
	type: ProductType;
	productId: number;
	productName: string;
	adventureCoin: number;
}
