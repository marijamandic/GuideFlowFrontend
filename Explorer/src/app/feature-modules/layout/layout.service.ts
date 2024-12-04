import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppRating } from './model/AppRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from './model/problem-notification.model';
import { environment } from 'src/env/environment';
import { Notification } from './model/Notification.model';

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

	getNotificationsByUserId(userId: number): Observable<Notification[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.get<Notification[]>(`${environment.apiHost}notifications/tourist/problem/by-user/${userId}`, { headers });
	}

	updateNotification(id: number, updatedNotification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.patch<void>(`${environment.apiHost}notifications/tourist/problem/${id}`, updatedNotification, { headers });
	}
	
	createNotification(notification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<void>(
			`${environment.apiHost}notifications/administrator/problem/money-exchange`,
			notification,
			{ headers }
		);
	}	
	
	patchIsOpened(id: number) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application-json'
		});

		return this.http.patch<ProblemNotification>(`${environment.apiHost}notifications/author/problem?id=${id}&isOpened=${true}`, { headers });
	}
}
