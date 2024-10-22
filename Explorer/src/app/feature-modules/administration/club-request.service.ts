import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { ClubRequest } from './model/club-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {
  constructor(private http: HttpClient) { }

  post(club: ClubRequest): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(environment.apiHost + 'request/clubRequest', club);
  }

  getClubRequest(id: number): Observable<PagedResults<ClubRequest>>{
    return this.http.get<PagedResults<ClubRequest>>(environment.apiHost + 'request/clubRequest/for-tourist/' + id);
  }

  cancelClubRequest(id: number): Observable<ClubRequest>{
    return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/cancel`, {});
  }

  getAllRequests(): Observable<PagedResults<ClubRequest>>{
    return this.http.get<PagedResults<ClubRequest>>(environment.apiHost + 'request/clubRequest/getAllRequests');
  }
  /**getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }
 */
  declineClubRequest(id: number): Observable<ClubRequest>{
    return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/decline`, {});
  }

  acceptClubRequest(id: number): Observable<ClubRequest>{
    return this.http.put<ClubRequest>(environment.apiHost + `request/clubRequest/${id}/accept`, {});
  }
}
