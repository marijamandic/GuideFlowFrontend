import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';

@Injectable({
	providedIn: 'root'
})
export class AdministrationService {
	constructor(private http: HttpClient) {}

	getEquipment(): Observable<PagedResults<Equipment>> {
		return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment');
	}

	deleteEquipment(id: number): Observable<Equipment> {
		return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
	}

	addEquipment(equipment: Equipment): Observable<Equipment> {
		return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
	}

	updateEquipment(equipment: Equipment): Observable<Equipment> {
		return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
	}

	getAllProblems(): Observable<PagedResults<Problem>> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`
		});
		return this.http.get<PagedResults<Problem>>(`${environment.apiHost}problems`, { headers });
	}
}
