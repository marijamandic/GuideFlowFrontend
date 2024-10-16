import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';
import { EquipmentComponent } from '../administration/equipment/equipment.component';
import { AdministrationModule } from '../administration/administration.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TourEquipmentComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdministrationModule
  ], 
  exports:[
    TourEquipmentComponent
  ]
})
export class TourAuthoringModule { }
