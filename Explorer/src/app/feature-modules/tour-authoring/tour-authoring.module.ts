import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';



@NgModule({
  declarations: [
    TourEquipmentComponent
  ],
  imports: [
    CommonModule
  ], 
  exports:[
    TourEquipmentComponent
  ]
})
export class TourAuthoringModule { }
