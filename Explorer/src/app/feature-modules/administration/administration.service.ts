import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from './model/club.model';
import { ClubRequest } from './model/club-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
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
  getClubs() : Observable<PagedResults<Club>>{
    return this.http.get<PagedResults<Club>>('https://localhost:44333/api/manageclub/club')
  }
  addClub(club: Club) : Observable<Club>{
    return this.http.post<Club>(environment.apiHost + 'manageclub/club',club);
  }
  deleteClub(id: number) : Observable<Club>{
    return this.http.delete<Club>(environment.apiHost + 'manageclub/club/' + id);
  }
  updateClub(club: Club) : Observable<Club>{
    return this.http.put<Club>(environment.apiHost + 'manageclub/club/' + club.id,club);
  }

  getClubRequest(): Observable<PagedResults<ClubRequest>>{
    return this.http.get<PagedResults<ClubRequest>>(environment.apiHost + 'request/clubRequest/1')
  }

  addRequest(clubRequest: ClubRequest): Observable<ClubRequest>{
    return this.http.post<ClubRequest>(environment.apiHost + 'request/clubRequest', clubRequest)
  }

  /*updateRequest(clubRequest: ClubRequest): Observable<ClubRequest>{
    return this.http.post<ClubRequest>(environment.apiHost + 'request/')
  }*/
  
  /*
  deleteRequest(clubRequest: ClubRequest): Observable<ClubRequest>{
    return this.http.post<ClubRequest>(environment.apiHost + 'request/')
  */
}
