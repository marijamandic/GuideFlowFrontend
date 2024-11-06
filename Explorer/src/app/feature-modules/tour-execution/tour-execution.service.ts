import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from './model/tour-review.model';
import { EquipmentManagement } from './model/equipment-management.model';
import { environment } from 'src/env/environment';
import { Problem } from 'src/app/shared/model/problem.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { TourExecution } from './model/tour-execution.model';
import { UpdateTourExecutionDto } from './model/update-tour-execution.dto';

@Injectable({
	providedIn: 'root'
})
export class TourExecutionService {
	constructor(private http: HttpClient) {}

	getEquipmentManagement(/*userId: number*/): Observable<PagedResults<EquipmentManagement>> {
		return this.http.get<PagedResults<EquipmentManagement>>(environment.apiHost + 'tourist/equipmentManagement' /*+ userId*/);
	}

	addEquipment(equipment_man: EquipmentManagement): Observable<EquipmentManagement> {
		return this.http.post<EquipmentManagement>(environment.apiHost + 'tourist/equipmentManagement', equipment_man);
	}

	deleteEquipment(equipment: EquipmentManagement): Observable<EquipmentManagement> {
		return this.http.delete<EquipmentManagement>(environment.apiHost + 'tourist/equipmentManagement/' + equipment.equipmentId);
	}

	createProblem(problem: Problem): Observable<Problem> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<Problem>(`${environment.apiHost}problems`, problem, { headers });
	}

	getReviews(): Observable<PagedResults<TourReview>> {
		return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/tourReview');
	}

	handleClick(tourReview: TourReview): Observable<TourReview> {
		return this.http.post<TourReview>('https://localhost:44333/api/tourist/tourReview', tourReview);
	}	
	getPercentage(tourExecutionId: number): Observable<number> {
		return this.http.get<number>(`https://localhost:44333/api/execution/tourExecution/${tourExecutionId}/completion-percentage`);
	}		
	getTourExecution(id:string){
		return this.http.get<TourExecution>(environment.apiHost+'execution/tourExecution/'+id);
	}
	updateTourExecution(updateTourExecutionDto : UpdateTourExecutionDto){
		return this.http.put<TourExecution>(environment.apiHost+'execution/tourExecution',updateTourExecutionDto)
	}
}
