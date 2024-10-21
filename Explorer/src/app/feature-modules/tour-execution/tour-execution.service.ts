import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { EquipmentManagement } from './model/equipment-management.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getEquipmentManagement(): Observable<PagedResults<EquipmentManagement>>{
    return this.http.get<PagedResults<EquipmentManagement>>('https://localhost:44333/api/equipmentManagement/equipmentManagement');
  }
}
