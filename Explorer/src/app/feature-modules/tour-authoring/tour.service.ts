import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { Tourist } from './model/tourist';
import { Checkpoint } from './model/tourCheckpoint.model';
import { TransportDuration } from './model/transportDuration.model';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getTour(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/authoring/tour')
  }

  getTourById(id:number):Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'authoring/tour/' + id)
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

  addCheckpoint(tourId:number,checkpoint:Checkpoint): Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/addingCheckpoint/'+ tourId, checkpoint)
  }

  updateCheckpoint(tourId:number,checkpoint:Checkpoint): Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/editingCheckpoint/'+ tourId, checkpoint)
  }

  deleteCheckpoint(id: number,checkpoint:Checkpoint): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/deletingCheckpoint/' + id,checkpoint);
  }

  updateTourLength(tourId:number,length:number):Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/updatingLength/'+ tourId, length)
  }

  addTransportDurations(tourId:number,transportDurations:TransportDuration[]):Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/addingTransportDuration/'+ tourId, transportDurations)
  }

  changeStatus(tourId:number,status:string):Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'authoring/tour/changeStatus/'+ tourId,JSON.stringify(status),
      { headers: { 'Content-Type': 'application/json' } })
  }

  getTouristById(id: number): Observable<Tourist> {
    return this.http.get<Tourist>(`https://localhost:44333/api/tourists/${id}`);
  }

  updateTourist(tourist: Tourist): Observable<Tourist> {
    return this.http.put<Tourist>(`https://localhost:44333/api/tourists/${tourist.id}`, tourist);
  }
  

  searchTours(latitude: number, longitude: number, distance: number, page: number = 0, pageSize: number = 0): Observable<Tour[]> {
    const url = `${environment.apiHost}authoring/tour/search/${latitude}/${longitude}/${distance}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<Tour[]>(url);
  }
}