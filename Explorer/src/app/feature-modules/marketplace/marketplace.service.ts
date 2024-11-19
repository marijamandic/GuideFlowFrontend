import { Injectable } from '@angular/core';
import { TourSpecification } from '../marketplace/model/tour-specification.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { SingleItemInput } from './model/shopping-carts/single-item-input';
import { SingleItem } from './model/shopping-carts/single-item';
import { ShoppingCart } from './model/shopping-carts/shopping-cart';
import Headers from 'src/app/shared/utils/headers';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPurchaseToken } from './model/purchase-tokens/tour-purchase-token';

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

	addToCart(item: SingleItemInput): Observable<SingleItem[]> {
		return this.http.post<SingleItem[]>(`${environment.apiHost}shopping-cart/single-items`, item, { headers: Headers });
	}

	removeFromCart(singleItemId: number): Observable<null> {
		return this.http.delete<null>(`${environment.apiHost}shopping-cart/single-items/${singleItemId}`, { headers: Headers });
	}

	getShoppingCartByTouristId(): Observable<ShoppingCart> {
		return this.http.get<ShoppingCart>(`${environment.apiHost}shopping-cart`, { headers: Headers });
	}

	//purchase tokens endpoints
	generateTokens():Observable<PagedResults<TourPurchaseToken>>{
		return this.http.post<PagedResults<TourPurchaseToken>>(environment.apiHost + "shopping/tourPurchaseToken",{});
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

	// updateCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
	// 	return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart);
	// }
}
