import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourEquipment } from './model/tour-equipment.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

    getTourEquipment(): Observable<PagedResults<TourEquipment>>{
    
      //ovo treba da se zameni da daje bas equipment za odredjenu turu
      return this.http.get<PagedResults<TourEquipment>>('https://localhost:44333/api/management/tourEquipment');
  }
}
