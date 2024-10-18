import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubInvitation } from './model/club-invitation.model';

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

  // Club Invitation
  getClubInvitations(): Observable<ClubInvitation[]> {
    return this.http.get<ClubInvitation[]>(environment.apiHost + 'invitation/clubInvitation/all');
  }

  getClubInvitationById(id: number): Observable<ClubInvitation> {
    return this.http.get<ClubInvitation>(environment.apiHost + `invitation/clubInvitation/${id}`);
  }

  declineClubInvitation(id: number): Observable<ClubInvitation> {
    return this.http.put<ClubInvitation>(environment.apiHost + `invitation/clubInvitation/${id}/decline`, {});
  }

  addClubInvitation(invitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.post<ClubInvitation>(environment.apiHost + 'invitation/clubInvitation', invitation);
  }

  updateClubInvitation(invitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.put<ClubInvitation>(`${environment.apiHost}/api/invitation/clubInvitation/${invitation.id}/update`, invitation);
  }  
}
