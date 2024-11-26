import { Injectable } from '@angular/core';
import { TourSpecification } from '../marketplace/model/tour-specification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

import { Item } from './model/shopping-carts/item';
import { ItemInput } from './model/shopping-carts/item-input';
import { ShoppingCart } from './model/shopping-carts/shopping-cart';
import Headers from 'src/app/shared/utils/headers';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPurchaseToken } from './model/purchase-tokens/tour-purchase-token';

import { Action } from 'rxjs/internal/scheduler/Action';
import { Tour } from '../tour-authoring/model/tour.model';
import { Payment } from './model/payments/payment';
import { TourBundle } from './model/tour-bundle.model';

@Injectable({
	providedIn: 'root'
})
export class MarketplaceService {
	constructor(private http: HttpClient) {}

	getTourSpecification(userId: number): Observable<TourSpecification> {
		return this.http.get<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + userId);
	}

	addTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.post<TourSpecification>(environment.apiHost + 'tourist/tourspecifications', tourSpecification);
	}

	updateTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.put<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id, tourSpecification);
	}

	deleteTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.delete<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id);
	}

	// shopping cart endpoints

	addToCart(item: ItemInput): Observable<Item[]> {
		return this.http.post<Item[]>(`${environment.apiHost}shopping-cart/items`, item, { headers: Headers });
	}

	removeFromCart(itemId: number): Observable<null> {
		return this.http.delete<null>(`${environment.apiHost}shopping-cart/items/${itemId}`, { headers: Headers });
	}

	getShoppingCartByTouristId(): Observable<ShoppingCart> {
		return this.http.get<ShoppingCart>(`${environment.apiHost}shopping-cart`, { headers: Headers });
	}

	//purchase tokens endpoints
	pay(): Observable<Payment> {
		return this.http.post<Payment>(environment.apiHost + 'shopping/payment', {});
	}
	//

	// getShoppingCartById(userId: number): Observable<ShoppingCart> {
	// 	return this.http.get<ShoppingCart>(environment.apiHost + 'shoppingCart/' + userId);
	// }

	// addItemToCart(userId: number, orderItem: OrderItem): Observable<void> {
	// 	return this.http.post<void>(environment.apiHost + 'shoppingCart/' + userId + '/items', orderItem);
	// }

	// removeItemFromCart(userId: number, tourId: number): Observable<void> {
	// 	return this.http.delete<void>(environment.apiHost + 'shoppingCart/' + userId + '/items/' + tourId);
	// }

	// clearCart(userId: number): Observable<void> {
	// 	return this.http.delete<void>(environment.apiHost + 'shoppingCart/' + userId + '/clear');
	// }

	updateCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
		return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart);
	}

	checkToken(userId: number, tourId: number): Observable<Tour> {
		return this.http.get<Tour>(environment.apiHost + 'execution/tourExecution/purchased/' + userId + '/' + tourId);
	}

	// updateCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
	// 	return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart);
	// }

	getTourBundles(authorId: number): Observable<PagedResults<TourBundle>> {
		return this.http.get<PagedResults<TourBundle>>(environment.apiHost + 'author/tourBundleMenagement?authorId=' + authorId)
	}

	createTourBundle(tourBundle: TourBundle): Observable<TourBundle> {
		return this.http.post<TourBundle>(environment.apiHost + 'author/tourBundleMenagement', tourBundle)
	}

	deleteTourBundle(tourBundleId: number): Observable<TourBundle> {
		return this.http.delete<TourBundle>(environment + 'api/tourBundleMenagement?tourBundleId=' + tourBundleId)

	}

	addTourToTourBundle(tourBundleId: number, tourId: number){
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundleMenagement/addTour?tourbBundleId=' + tourBundleId + '&tourId=' + tourId, null)
	}

	removeTourFromTourBundle(tourBundleId: number, tourId: number)
	{
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundleMenagement/removeTour?tourBundleId=' + tourBundleId + '&tourId=' + tourId, null)
	}

	publishTourBundle(tourBundleId: number){
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundleMenagement/publish?tourBundleId=' + tourBundleId, null)
	}

	archiveTourBundle(tourbBundleId: number){
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundleMenagement/archive?tourBundleId=' + tourbBundleId, null)
	}
}
