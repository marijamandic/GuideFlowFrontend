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
    return this.http.get<PagedResults<ClubRequest>>(environment.apiHost + 'request/clubRequest/for-tourist/' + id)
  }
}
