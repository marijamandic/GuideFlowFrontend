import { PaymentItem } from './payment-item';

export interface Payment {
	id: number;
	touristId: number;
    purchaseDate:Date;
	paymentItems: PaymentItem[];
}