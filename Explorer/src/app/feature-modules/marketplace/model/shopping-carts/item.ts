import { ProductType } from '../product-type';
import { TourBundle } from '../tour-bundle.model';
import { TourDetails } from './tour-details';

export interface Item {
	id: number;
	shoppingCartId: number;
	type: ProductType;
	productId: number;
	productName: string;
	product?: TourDetails | TourBundle;
	adventureCoin: number;
}
