import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { ProfileInfo } from './model/profile-info.model';
import { environment } from 'src/env/environment';
import { map, Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from 'src/app/shared/model/problem.model';
import { Club } from './model/club.model';
import { ClubRequest } from './model/club-request.model';
import { ClubInvitation } from './model/club-invitation.model';
import { ClubMemberList } from './model/club-member-list.model';
import { Account } from './model/account.model';
import { ClubPost } from './model/club-post.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../tour-authoring/model/tourist';
import { TouristRegistraion } from 'src/app/infrastructure/auth/model/touristRegister.model';

@Injectable({
	providedIn: 'root'
})
export class AdministrationService {
	constructor(private http: HttpClient) {}

	// ##### Equipment ##### 
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

 	// ##### Problems ##### 
	getAllProblems():Observable<PagedResults<Problem>> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`
		});
		return this.http.get<PagedResults<Problem>>(`${environment.apiHost}administrator/problems`, { headers });
	}
	getProblems(): Observable<PagedResults<Problem>>{
		return this.http.get<PagedResults<Problem>>(environment.apiHost + 'administrator/problems');
	}
	updateDeadline(id: number,date : string) : Observable<Problem>{
		return this.http.put<Problem>(environment.apiHost + 'administrator/problems/' + id + '/deadline',{ Date: date });
	}

	//  ##### Club ##### 
	getClubs(): Observable<PagedResults<Club>> {
		return this.http.get<PagedResults<Club>>(environment.apiHost + 'manageclub/club');
	}
	getClubById(clubId: number): Observable<Club> {
		return this.http.get<Club>(environment.apiHost + 'manageclub/club/' + clubId);
	}	  
	addClub(club: Club): Observable<Club> {
		return this.http.post<Club>(environment.apiHost + 'manageclub/club', club);
	}
	deleteClub(id: number): Observable<Club> {
		return this.http.delete<Club>(environment.apiHost + 'manageclub/club/' + id);
	}
	updateClub(club: Club): Observable<Club> {
		return this.http.put<Club>(environment.apiHost + 'manageclub/club/' + club.id, club);
	}

	// #####  Club Invitation ##### 
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

	getClubInvitationsByClubId(clubId: number): Observable<ClubInvitation[]> {
		return this.http.get<ClubInvitation[]>(`${environment.apiHost}invitation/clubInvitation/club/${clubId}`);
	}

	// ##### Club request ##### 
	addRequest(clubRequest: ClubRequest): Observable<ClubRequest> {
		return this.http.post<ClubRequest>(environment.apiHost + 'request/clubRequest', clubRequest);
	}
	  
	getClubRequestByUser(userId: number): Observable<ClubRequest[]> {
		return this.http.get<ClubRequest[]>(
		  `${environment.apiHost}request/clubRequest/for-tourist/${userId}`
		);
	}
			  
	cancelClubRequest(id: number): Observable<ClubRequest> {
		return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/cancel`, {});
	}
	  
	declineClubRequest(id: number): Observable<ClubRequest> {
		return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/decline`, {});
	}
	  
	acceptClubRequest(id: number): Observable<ClubRequest> {
		return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/accept`, {});
	}	  

	getClubRequestsByClubId(clubId: number): Observable<ClubRequest[]> {
		return this.http.get<ClubRequest[]>(environment.apiHost + `request/clubRequest/club/${clubId}`);
	  }	  

	// ##### Club membership ##### 
	getAllClubMembers(clubId: number): Observable<ClubMemberList[]> {
		return this.http.get<ClubMemberList[]>(`${environment.apiHost}members/clubMember/${clubId}/all`);
	}

	removeClubMember(clubId: number, userId: number): Observable<void> {
		return this.http.delete<void>(`${environment.apiHost}members/clubMember/${clubId}/${userId}`);
	}

	//  ##### Profile  ##### 
	getAccounts(): Observable<Array<Account>> {
		return this.http.get<Array<Account>>(environment.apiHost + 'administration/account');
	}

	toggleAcountActivity(account: Account): Observable<Account> {
		return this.http.patch<Account>(environment.apiHost + 'administration/account', account);
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
	addClubPost(clubPost: ClubPost): Observable<ClubPost> {
		return this.http.post<ClubPost>(environment.apiHost + 'administration/clubpost', clubPost);
	}
	getClubPosts(): Observable<ClubPost[]> {
		return this.http.get<ClubPost[]>(environment.apiHost + 'administration/clubpost');
	}

	getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${environment.apiHost}user/all`);
	}  

	// ##### User #####
	getUsername(userId: number): Observable<string> {
		return this.http.get<{ username: string }>(`${environment.apiHost}user/username/${userId}`)
		  .pipe(map(response => response.username));
	}

	getUserById(userId: number): Observable<User> {
		const url = `${environment.apiHost}user/getUser/${userId}`;
		return this.http.get<User>(url);
	  }

	updateMoney(touristId: number, amount: number): Observable<User> {
		return this.http.put<User>(
		  `${environment.apiHost}user/updateMoney/${touristId}`,
		  amount
		);
	  }
	  
	createTourist(userDto: TouristRegistraion): Observable<User> {
	const headers = new HttpHeaders({
		'Content-Type': 'application/json',
		});
		return this.http.post<User>(
			`${environment.apiHost}tourists`,
			userDto,
			{ headers }
		);
	} 
	getFollowedProfiles(userId: number): Observable<number[]> {
		return this.http.get<number[]>(`${environment.apiHost}administration/profileInfo/followed/${userId}`);
	  }

	  followUser(followedId: number, followerId: number, followerUsername: string, imageUrl: string): Observable<void> {
		const body = {
		  followerId: followerId,
		  followerUsername: followerUsername,
		  imageUrl: imageUrl,
		};
		return this.http.put<void>(`${environment.apiHost}administration/profileInfo/follower/${followedId}`, body);
	  }
	  
	  
}
