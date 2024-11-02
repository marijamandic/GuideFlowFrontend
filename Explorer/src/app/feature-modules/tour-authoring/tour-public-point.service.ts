import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicPoint } from './model/publicPoint.model';

@Injectable({
  providedIn: 'root'
})
export class PublicPointService {

  private baseUrl = 'https://localhost:44333/api/administration/publicpoint'; 
  constructor(private http: HttpClient) { }

  getPublicPoints(page: number, pageSize: number): Observable<{ results: PublicPoint[], totalCount: number }> {
    return this.http.get<{ results: PublicPoint[], totalCount: number }>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  addPublicPoint(publicPoint: PublicPoint): Observable<PublicPoint> {
    return this.http.post<PublicPoint>(`${this.baseUrl}`, publicPoint);
  }

  updatePublicPoint(publicPoint: PublicPoint): Observable<PublicPoint> {
    return this.http.put<PublicPoint>(`${this.baseUrl}/${publicPoint.id}`, publicPoint);
  }

  deletePublicPoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  } 
  
  getPublicPointsByTour(tourId: number): Observable<PublicPoint[]> {
    return this.http.get<PublicPoint[]>(`${this.baseUrl}/tour/${tourId}`);
  }  
  
  getPendingPublicPoints(): Observable<PublicPoint[]> {
    return this.http.get<PublicPoint[]>(`${this.baseUrl}/pending`);
  }
}
