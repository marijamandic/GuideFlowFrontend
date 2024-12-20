import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourSpecification } from '../tour-execution/model/tour-specification.model';

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
import { Coupon } from './model/coupon.model';

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

	//purchase tokens endpoints
	pay(): Observable<Payment> {
		return this.http.post<Payment>(environment.apiHost + 'shopping/payment', {});
	}

	checkToken(userId: number, tourId: number): Observable<Tour> {
		return this.http.get<Tour>(environment.apiHost + 'execution/tourExecution/purchased/' + userId + '/' + tourId);
	}

	checkIfPurchased(tourId: number): Observable<TourPurchaseToken> {
		return this.http.get<TourPurchaseToken>(environment.apiHost + 'shopping/tourPurchaseToken/tour/' + tourId);
	}

	// updateCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
	// 	return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart);
	// }

	getTourBundles(authorId: number): Observable<PagedResults<TourBundle>> {
		return this.http.get<PagedResults<TourBundle>>(environment.apiHost + 'author/tourBundlesManagement?authorId=' + authorId);
	}

	createTourBundle(tourBundle: TourBundle): Observable<TourBundle> {
		return this.http.post<TourBundle>(environment.apiHost + 'author/tourBundlesManagement', tourBundle);
	}

	deleteTourBundle(tourBundleId: number): Observable<TourBundle> {
		return this.http.delete<TourBundle>(environment.apiHost + 'author/tourBundlesManagement?tourBundleId=' + tourBundleId);
	}

	modifyTourBundle(tourBundle: TourBundle): Observable<TourBundle> {
		return this.http.put<TourBundle>(environment.apiHost + 'author/tourBundlesManagement', tourBundle);
	}

	publishTourBundle(tourBundleId: number) {
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundlesManagement/publish?tourBundleId=' + tourBundleId, null);
	}

	archiveTourBundle(tourbBundleId: number) {
		return this.http.patch<TourBundle>(environment.apiHost + 'author/tourBundlesManagement/archive?tourBundleId=' + tourbBundleId, null);
	}
	//Coupon
	createCoupon(coupon: Coupon): Observable<Coupon> {
		return this.http.post<Coupon>(environment.apiHost + 'shopping/coupons', coupon);
	}

	getCouponByCode(code: string): Observable<Coupon> {
		return this.http.get<Coupon>(environment.apiHost + 'shopping/coupons/code/' + code);
	}

	getCouponsByAuthorId(authorId: number): Observable<Coupon[]> {
		return this.http.get<Coupon[]>(`${environment.apiHost}shopping/coupons/author/${authorId}`);
	}

	updateCoupon(couponId: number, coupon: Partial<Coupon>): Observable<Coupon> {
		return this.http.put<Coupon>(`${environment.apiHost}shopping/coupons/${couponId}`, coupon);
	}

	deleteCoupon(couponId: number): Observable<void> {
		return this.http.delete<void>(`${environment.apiHost}shopping/coupons/${couponId}`);
	}

	redeemCoupon(code: string): Observable<void> {
		return this.http.put<void>(environment.apiHost + 'tourist/shopping/coupons/redeem/' + code, null);
	}

	getBundleById(id: number): Observable<TourBundle> {
		return this.http.get<TourBundle>(`${environment.apiHost}bundles/${id}`);
	}
}
