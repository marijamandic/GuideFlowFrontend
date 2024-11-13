import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { ProfileInfo } from './model/profile-info.model'
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from 'src/app/shared/model/problem.model';
import { Club } from './model/club.model';
import { ClubRequest } from './model/club-request.model';
import { ClubInvitation } from './model/club-invitation.model';
import { ClubMemberList } from './model/club-member-list.model';
import { Account } from './model/account.model';
import { Follower } from './model/follower.model';

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

  acceptClubInvitation(id: number): Observable<ClubInvitation> {
    return this.http.put<ClubInvitation>(environment.apiHost + `invitation/clubInvitation/${id}/accept`, {});
  }

  addClubInvitation(invitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.post<ClubInvitation>(environment.apiHost + 'invitation/clubInvitation', invitation);
  }

  updateClubInvitation(invitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.put<ClubInvitation>(`${environment.apiHost}/api/invitation/clubInvitation/${invitation.id}/update`, invitation);
  }  

  // Club membership
  getAllClubMembers(clubId: number): Observable<ClubMemberList[]> {
    return this.http.get<ClubMemberList[]>(`${environment.apiHost}members/clubMember/${clubId}/all`);
  }

  removeClubMember(clubId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiHost}members/clubMember/${clubId}/${userId}`);
  }

  getAllRequests(): Observable<ClubRequest[]>{
    return this.http.get<ClubRequest[]>(environment.apiHost + 'request/clubRequest/getAllRequests');
  }
  getAccounts(): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(environment.apiHost + 'administration/account');
  }

  toggleAcountActivity(account : Account): Observable<Account> {
    return this.http.patch<Account>(environment.apiHost + "administration/account", account);
  }

  getProfileInfoByUserId(userId: number): Observable<ProfileInfo> {
    return this.http.get<ProfileInfo>(environment.apiHost + 'administration/profileInfo/' + userId);
  }  
  
  updateProfileInfo(profileInfo: ProfileInfo): Observable<ProfileInfo> {
    return this.http.put<ProfileInfo>(
      `${environment.apiHost}administration/profileInfo/${profileInfo.id}/${profileInfo.userId}`,
      profileInfo
    );
  }  
  
  getProfileInfo(): Observable<PagedResults<ProfileInfo>> {
    return this.http.get<PagedResults<ProfileInfo>>(environment.apiHost + 'administration/profileInfo');
  } 
  
  getFollower(userId : number) : Observable<PagedResults<Follower>> {
    return this.http.get<PagedResults<Follower>>(environment.apiHost + 'tourist/follower')
  }
}
