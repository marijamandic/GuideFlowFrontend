import { TourDetails } from './shopping-carts/tour-details';

export interface TourBundle {
	id: number;
	name: string;
	description: string;
	imageUrl: string;
	price: number;
	status: BundleStatus;
	authorId: number;
	tourIds: Array<number>;
	tours?: Array<TourDetails>;
}

export enum BundleStatus {
	Draft,
	Published,
	Archived
}
