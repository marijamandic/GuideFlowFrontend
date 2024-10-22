import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { ProfileInfo } from './model/profile-info.model'
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
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

  getProfileInfoByUserId(userId: number): Observable<ProfileInfo> {
    return this.http.get<ProfileInfo>(environment.apiHost + 'administration/profileInfo/' + userId);
  }  
  
  updateProfileInfo(profileInfo: ProfileInfo): Observable<ProfileInfo> {
    return this.http.put<ProfileInfo>(
      `${environment.apiHost}administration/profileInfo/${profileInfo.id}/${profileInfo.userId}`,
      profileInfo
    );
  }  
  
}
