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

    getTourEquipment(tourId: number): Observable<any[]>{

      return this.http.get<any[]>(`https://localhost:44333/api/administration/tourEquipment/${tourId}`);
  }

    getAllByTour(id: number):Observable<any[]>{

      return this.http.get<any[]>(`https://localhost:44333/api/administration/tourEquipment/tour/${id}`);
    }
  
    getEquipment(): Observable<PagedResults<Equipment>>{
    
    //ovo treba da se zameni da daje samo equipment koji nema u tourEquipment
    return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/management/equipment');
}

    addTourEquipment(equipmentId : number, tourId: number, quantity:number):Observable<TourEquipment>{
      return this.http.post<TourEquipment>('https://localhost:44333/api/administration/tourEquipment', {equipmentId,tourId,quantity});
    }

    deleteTourEquipment(tourEqId: number):Observable<TourEquipment>{
      return this.http.delete<TourEquipment>(`https://localhost:44333/api/administration/tourEquipment/${tourEqId}`);
    }
}
