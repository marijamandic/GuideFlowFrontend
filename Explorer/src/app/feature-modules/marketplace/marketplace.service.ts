import { Injectable } from '@angular/core';
import { TourSpecification } from '../marketplace/model/tour-specification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { ShoppingCart } from './model/shoppingCart.model';



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

  updateShoppingCart (shoppingCart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'shoppingCart/', shoppingCart)
  }
}
