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
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/authoring/tour')
  }

  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'authoring/tour/' + id);
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'authoring/tour/' + id);
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'authoring/tour', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/' + tour.id, tour);
  }

  getTouristById(id: number): Observable<Tourist> {
    return this.http.get<Tourist>(`https://localhost:44333/api/tourists/${id}`);
  }

  updateTourist(tourist: Tourist): Observable<Tourist> {
    return this.http.put<Tourist>(`https://localhost:44333/api/tourists/${tourist.id}`, tourist);
  }
  
  publishTour(tour:Tour): Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/publish/'+ tour.id, tour)
  }

  searchTours(latitude: number, longitude: number, distance: number, page: number = 0, pageSize: number = 0): Observable<Tour[]> {
    const url = `${environment.apiHost}authoring/tour/search/${latitude}/${longitude}/${distance}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<Tour[]>(url);
}
}