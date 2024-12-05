import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, map, Observable, switchMap } from 'rxjs';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Execution } from './model/execution.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterExecutionService {

  private baseUrl = 'https://localhost:44333/api/admin/encounter'; 
  constructor(private http: HttpClient) { }
  
  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(`${this.baseUrl}`)
  }

  addEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + 'admin/encounter', encounter);
  }
  authorAddEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.post<Encounter>(environment.apiHost + 'author/encounter', encounter);
  }
  updateEncounter(encounter: any): Observable<Encounter> {
    return this.http.put<Encounter>(environment.apiHost + 'admin/encounter', encounter);
  }

  touristGetEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'tourist/encounter')
  }
  
  getEncounter(encounterId: number): Observable<Encounter> {
    return this.http.get<Encounter>(environment.apiHost + `admin/encounter/${encounterId}`)
  }

  addEncounterExecution(execution: Execution): Observable<Execution>{
    return this.http.post<Execution>('https://localhost:44333/api/tourist/encounterExecution', execution);
  }
 
  getExecution(executionId: string): Observable<Execution>{
    return this.http.get<Execution>('https://localhost:44333/api/tourist/encounterExecution/' + executionId);
  }

  completeExecution(execution: Execution): Observable<Execution>{
    return this.http.put<Execution>('https://localhost:44333/api/tourist/encounterExecution/' + execution.id, execution);
  }

  completeSocialExecution(execution: Execution): Observable<Execution> {
    console.log('usao u servis');
    return this.http.put<Execution>('https://localhost:44333/api/tourist/encounterExecution/completeSocial/' + execution.id, execution);
  }
  
  getExecutionByUser(userId: number): Observable<Execution[]>{
    return this.http.get<Execution[]>('https://localhost:44333/api/tourist/encounterExecution/getByUser/' + userId);
  }
  getAllEncounterIdsByUserId(userId: number): Observable<number[]>{
    return this.http.get<number[]>(environment.apiHost+'tourist/encounterExecution/getAllByUser/' + userId);
  }

  findExecution(userId: number, encounterId: number): Observable<Execution | null> {
    return this.http.get<Execution | null>(`https://localhost:44333/api/tourist/encounterExecution/findExecution/${userId}/${encounterId}`);
  }

  /*getActiveParticipants(execution: Execution, latitude: number, longitude: number): Observable<any> {
    return this.http.post<any>(`https://localhost:44333/api/tourist/encounterExecution/active-participants`+latitude + longitude, execution);
  }

  startActiveParticipantsCheck(execution: Execution, latitude: number, longitude: number): Observable<any> {
    return interval(10000).pipe( // Periodičan poziv svakih 10 sekundi
      switchMap(() => this.getActiveParticipants(execution, latitude, longitude))
    );
  }*/
}
