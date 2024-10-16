import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubComponent } from './club/club.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubFormComponent,
    ClubComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubFormComponent,
    ClubComponent
  ]
})
export class AdministrationModule { }
