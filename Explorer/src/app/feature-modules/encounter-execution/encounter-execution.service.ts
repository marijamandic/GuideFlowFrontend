import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Encounter } from './model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';

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

  getEncounter(encounterId: number): Observable<Encounter> {
    return this.http.get<Encounter>(environment.apiHost + `admin/encounter/${encounterId}`)
  }
}
