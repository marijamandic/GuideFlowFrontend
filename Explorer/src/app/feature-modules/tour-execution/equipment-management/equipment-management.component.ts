import { Component, OnInit } from '@angular/core';
import { EquipmentManagement } from '../model/equipment-management.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.css']
})
export class EquipmentManagementComponent implements OnInit {
  

  equipment_management: EquipmentManagement[] = []

  constructor(private service: TourExecutionService)
  {

  }
  
  ngOnInit(): void {
    this.service.getEquipmentManagement().subscribe({
      next: (result: PagedResults<EquipmentManagement>) => {
        this.equipment_management = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
 
}
