import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Problem } from 'src/app/shared/model/problem.model';
import { environment } from 'src/env/environment';

@Injectable({
	providedIn: 'root'
})
export class TourExecutionService {
	constructor(private http: HttpClient) {}

	createProblem(problem: Problem): Observable<Problem> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<Problem>(`${environment.apiHost}problems`, problem, { headers });
	}
}
