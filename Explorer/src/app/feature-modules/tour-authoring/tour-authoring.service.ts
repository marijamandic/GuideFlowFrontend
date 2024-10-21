import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourEquipment } from './model/tour-equipment.model';
import { Equipment } from '../administration/model/equipment.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

    getTourEquipment(tourId: number): Observable<PagedResults<Equipment>>{
    
      //ovo treba da se zameni da daje bas equipment za odredjenu turu
      return this.http.get<PagedResults<Equipment>>(`https://localhost:44333/api/administration/tourEquipment/${tourId}`);
  }

    getAll():Observable<PagedResults<TourEquipment>>{

      return this.http.get<PagedResults<TourEquipment>>('https://localhost:44333/api/administration/tourEquipment');
    }
  
    getEquipment(): Observable<PagedResults<Equipment>>{
    
    //ovo treba da se zameni da daje bas equipment za odredjenu turu
    return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/management/equipment');
}
}
