import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';



@NgModule({
  declarations: [
    EquipmentManagementComponent
  ],
  imports: [
    CommonModule
  ],
  exports:
  [
     EquipmentManagementComponent
  ]
})
export class TourExecutionModule { }
