import { Injectable } from '@angular/core';
import { TourSpecification } from '../marketplace/model/tour-specification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { ShoppingCart } from './model/shoppingCart.model';
import { Action } from 'rxjs/internal/scheduler/Action';
import { OrderItem } from './model/orderItem.model';
import { Tour } from '../tour-authoring/model/tour.model';



@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getTourSpecification (userId : number) : Observable<TourSpecification>{
    return this.http.get<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + userId);
  }

  addTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
    return this.http.post<TourSpecification>(environment.apiHost + 'tourist/tourspecifications', tourSpecification);
  }

  updateTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification>{
    return this.http.put<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id, tourSpecification);
  }

  deleteTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification>{
    return this.http.delete<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id);
  }

  getShoppingCartById (userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(environment.apiHost + 'shoppingCart/' + userId)
  }

  addItemToCart(userId: number, orderItem: OrderItem) : Observable<void> {
    return this.http.post<void>(environment.apiHost + 'shoppingCart/' + userId + '/items', orderItem)
  }

  removeItemFromCart(userId: number, tourId: number) : Observable<void>  {
    return this.http.delete<void>(environment.apiHost + 'shoppingCart/' + userId + '/items/' + tourId )
  }

  clearCart(userId: number) : Observable<void> {
    return this.http.delete<void>(environment.apiHost + 'shoppingCart/' + userId + '/clear')
  }

  updateCart(shoppingCart: ShoppingCart) : Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart)
  }
  checkToken(userId: number, tourId: number) : Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'execution/tourExecution/purchased/'+ userId + '/' + tourId)
  }
}
