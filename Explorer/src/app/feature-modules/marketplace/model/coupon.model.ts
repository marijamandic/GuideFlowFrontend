export interface Coupon {
	id: number;
    authorId: number;
    tourId?: number | null;
    code: string;
    discount: number;
    expiryDate?: string;
    validForAllTours: boolean;
    redeemed: boolean;
}
