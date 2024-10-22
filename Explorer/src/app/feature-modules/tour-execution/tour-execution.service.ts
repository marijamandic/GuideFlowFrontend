import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { EquipmentManagement } from './model/equipment-management.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getEquipmentManagement(/*userId: number*/): Observable<PagedResults<EquipmentManagement>>{
    return this.http.get<PagedResults<EquipmentManagement>>(environment.apiHost + 'tourist/equipmentManagement'/*+ userId*/);
    
  }

  addEquipment(equipment_man: EquipmentManagement): Observable<EquipmentManagement>
  {
    return this.http.post<EquipmentManagement>(environment.apiHost + 'tourist/equipmentManagement', equipment_man)
  }

  deleteEquipment(equipment: EquipmentManagement): Observable<EquipmentManagement>{
    return this.http.delete<EquipmentManagement>(environment.apiHost + 'tourist/equipmentManagement/'+ equipment.equipmentId);
  }
}
