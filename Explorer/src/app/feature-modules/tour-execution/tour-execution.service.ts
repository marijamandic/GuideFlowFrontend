import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from './model/tour-review.model';
import { EquipmentManagement } from './model/equipment-management.model';
import { environment } from 'src/env/environment';
import { Problem } from 'src/app/shared/model/problem.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { CreateProblemInput } from './model/create-problem-input.model';
import { ProblemStatusComponent } from './problem-status/problem-status.component';
import { ProblemStatus } from './model/problem-status.model';
import { TourExecution } from './model/tour-execution.model';
import { UpdateTourExecutionDto } from './model/update-tour-execution.dto';
import { PurchasedTours } from './model/purchased-tours.model';
import { CreateTourExecutionDto } from './model/create-tour-execution.dto';
import { TourSpecification } from './model/tour-specification.model';
import { Sales } from './model/sales.model';
import { TourBundle } from '../marketplace/model/tour-bundle.model';

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

	createProblem(problem: CreateProblemInput): Observable<Problem> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<Problem>(`${environment.apiHost}tourist/problems`, problem, { headers });
	}
	getUserProblems(userId: number): Observable<PagedResults<Problem>> {
		return this.http.get<PagedResults<Problem>>(environment.apiHost + 'tourist/problems');
	}
	changeProblemStatus(id: number, changedStatus: ProblemStatus): Observable<Problem> {
		return this.http.put<Problem>(environment.apiHost + 'tourist/problems/' + id, changedStatus);
	}

	getReviews(): Observable<PagedResults<TourReview>> {
		return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/tourReview');
	}

	getAllTours(): Observable<PagedResults<Tour>> {
		return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/authoring/tour');
	}

	handleClick(tourReview: TourReview): Observable<TourReview> {
		return this.http.post<TourReview>('https://localhost:44333/api/tourist/tourReview', tourReview);
	}
	getPercentage(tourExecutionId: number): Observable<number> {
		return this.http.get<number>(`https://localhost:44333/api/execution/tourExecution/${tourExecutionId}/completion-percentage`);
	}
	getTourExecution(id: string) {
		return this.http.get<TourExecution>(environment.apiHost + 'execution/tourExecution/' + id);
	}
	getCompletedToursByTourist(id:number) {
		return this.http.get<number[]>(environment.apiHost + 'execution/tourExecution/completed/'+id)
	}
	updateTourExecution(updateTourExecutionDto: UpdateTourExecutionDto) {
		return this.http.put<TourExecution>(environment.apiHost + 'execution/tourExecution', updateTourExecutionDto);
	}

	getPurchased(id: number) {
		return this.http.get<PurchasedTours[]>(environment.apiHost + 'execution/tourExecution/purchased/' + id);
	}

	createSession(createTourExecutionDto: CreateTourExecutionDto) {
		return this.http.post<TourExecution>(environment.apiHost + 'execution/tourExecution', createTourExecutionDto);
	}

	completeSession(id: number): Observable<any> {
		return this.http.put<any>(environment.apiHost + 'execution/tourExecution/complete/' + id, null);
	}

	abandonSession(id: number): Observable<any> {
		return this.http.put<any>(environment.apiHost + 'execution/tourExecution/abandon/' + id, null);
	}

	getActiveSessionByUser(id: number) {
		return this.http.get<TourExecution>(environment.apiHost + 'execution/tourExecution/getByUser/' + id);
	}

	getTourSpecification(userId: number): Observable<TourSpecification> {
		return this.http.get<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + userId);
	}

	addTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.post<TourSpecification>(environment.apiHost + 'tourist/tourspecifications', tourSpecification);
	}

	updateTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.put<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id, tourSpecification);
	}

	deleteTourSpecification(tourSpecification: TourSpecification): Observable<TourSpecification> {
		return this.http.delete<TourSpecification>(environment.apiHost + 'tourist/tourspecifications/' + tourSpecification.id);
	}

	getAllSales(): Observable<Sales[]> {
		return this.http.get<Sales[]>('https://localhost:44333/api/sales');
	}

	searchTours(latitude: number, longitude: number, distance: number, page: number = 0, pageSize: number = 0): Observable<Tour[]> {
		const url = `${environment.apiHost}authoring/tour/search/${latitude}/${longitude}/${distance}?page=${page}&pageSize=${pageSize}`;
		return this.http.get<Tour[]>(url);
	}

	changeStatus(tourId: number, status: string): Observable<Tour> {
		return this.http.put<Tour>(environment.apiHost + 'authoring/tour/changeStatus/' + tourId, JSON.stringify(status), {
			headers: { 'Content-Type': 'application/json' }
		});
	}

	getSuggestedTours(longitude: number, latitude: number): Observable<Tour[]> {
		return this.http.get<Tour[]>(environment.apiHost + 'execution/tourExecution/suggested/' + longitude + '/' + latitude);
	}

	getPublishedBundles(): Observable<PagedResults<TourBundle>> {
		return this.http.get<PagedResults<TourBundle>>(`${environment.apiHost}bundles`);
	}
}
