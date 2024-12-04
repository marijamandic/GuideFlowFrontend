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
import { TourBundle } from './model/tour-bundle';

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

	getBundleById(id: number): Observable<TourBundle> {
		return this.http.get<TourBundle>(environment.apiHost + 'shopping/tourBundle/' + id);
	}
}
