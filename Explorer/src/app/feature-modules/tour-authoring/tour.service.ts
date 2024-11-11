import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { Tourist } from './model/tourist';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getTour(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tours');
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'author/tours/' + id);
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'author/tours', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'author/tours/' + tour.id, tour);
  }

  getTouristById(id: number): Observable<Tourist> {
    return this.http.get<Tourist>(`https://localhost:44333/api/tourists/${id}`);
  }

  updateTourist(tourist: Tourist): Observable<Tourist> {
    return this.http.put<Tourist>(`https://localhost:44333/api/tourists/${tourist.id}`, tourist);
  }
  
}
