import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourSpecification } from './model/tour-specification.model';

@Injectable({
  providedIn: 'root'
})
export class TourSpecificationService {

  constructor(private http: HttpClient) { }

  getTourSpecifications () : Observable<PagedResults<TourSpecification>>{
    return this.http.get<PagedResults<TourSpecification>>('');
  }
}
