import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourObject } from './model/tourObject.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTourObjects(): Observable<PagedResults<TourObject>> {
    return this.http.get<PagedResults<TourObject>>(environment.apiHost + 'administration/tourObject')
  }

  addTourObject(tourObject: TourObject): Observable<TourObject> {
    return this.http.post<TourObject>(environment.apiHost + 'administration/tourObject', tourObject)
  }
}
