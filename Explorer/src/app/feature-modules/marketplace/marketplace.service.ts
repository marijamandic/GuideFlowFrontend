import { Injectable } from '@angular/core';
import { TourSpecification } from '../marketplace/model/tour-specification.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';


@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getTourSpecifications () : Observable<PagedResults<TourSpecification>>{
    return this.http.get<PagedResults<TourSpecification>>(environment.apiHost + 'tourist/tourspecifications');
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
}
