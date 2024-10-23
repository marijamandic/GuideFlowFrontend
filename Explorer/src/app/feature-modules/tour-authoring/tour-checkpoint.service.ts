import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checkpoint } from './model/tourCheckpoint.model';

@Injectable({
  providedIn: 'root'
})
export class TourCheckpointService {

  private baseUrl = 'https://localhost:44333/api/administration/checkpoint'; 
  constructor(private http: HttpClient) { }

  getCheckpoints(page: number, pageSize: number): Observable<{ results: Checkpoint[], totalCount: number }> {
    return this.http.get<{ results: Checkpoint[], totalCount: number }>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  addCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(`${this.baseUrl}`, checkpoint);
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(`${this.baseUrl}/${checkpoint.id}`, checkpoint);
  }

  deleteCheckpoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }  
}
