import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getTour(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tours')
  }
}
