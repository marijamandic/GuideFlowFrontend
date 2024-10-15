import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedResults } from '../shared/model/paged-results.model';
import { ClubRequest } from './model/club-request.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getClubRequest(): Observable<PagedResults<ClubRequest>>{
    return this.http.get<PagedResults<ClubRequest>>('https://localhost:44333/api/request/clubRequest/1')
  }
}
