import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppRating } from './model/AppRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class AppRatingService {
  private apiUrl = 'https://localhost:44333/api/tourist/AppRating/rating'; 

  constructor(private http: HttpClient) {}

  postNewAppRating(rating: AppRating): Observable<AppRating> {
    return this.http.post<AppRating>(this.apiUrl, rating);
  }
  
  getAppRatings(page: number, pageSize: number): Observable<PagedResults<AppRating>> {
    return this.http.get<PagedResults<AppRating>>(`https://localhost:44333/api/tourist/AppRating/all?page=${page}&pageSize=${pageSize}`);
}



}
