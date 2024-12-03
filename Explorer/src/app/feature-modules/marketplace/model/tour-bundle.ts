import { BundleStatus } from "./bundle-status";

export interface TourBundle {
	id?: number;
	name: string;
	price: number;
    status: BundleStatus;
    authorId: number;
    tourIds: number[];
}