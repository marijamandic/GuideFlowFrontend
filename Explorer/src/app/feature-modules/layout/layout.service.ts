import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppRating } from './model/AppRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from './model/problem-notification.model';
import { environment } from 'src/env/environment';

@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	private apiUrl = 'https://localhost:44333/api/tourist/AppRating/rating';

	constructor(private http: HttpClient) {}

	postNewAppRating(rating: AppRating): Observable<AppRating> {
		return this.http.post<AppRating>(this.apiUrl, rating);
	}

	getAppRatings(page: number, pageSize: number): Observable<PagedResults<AppRating>> {
		return this.http.get<PagedResults<AppRating>>(`https://localhost:44333/api/tourist/AppRating/all?page=${page}&pageSize=${pageSize}`);
	}

	getProblemNotificationsByUserId(role: string): Observable<PagedResults<ProblemNotification>> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application-json'
		});
		return this.http.get<PagedResults<ProblemNotification>>(`${environment.apiHost}notifications/${role}/problem`, { headers });
	}
}
