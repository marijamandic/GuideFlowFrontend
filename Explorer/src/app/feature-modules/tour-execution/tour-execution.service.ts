import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from './model/tour-review.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getReviews(): Observable<PagedResults<TourReview>>{
    return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/tourReview');
  }
}
