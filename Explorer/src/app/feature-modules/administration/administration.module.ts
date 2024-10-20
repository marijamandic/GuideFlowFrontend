import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubComponent } from './club/club.component';
import { ClubRequestComponent } from './club-request/club-request.component';
import { ClubRequestFormComponent } from './club-request-form/club-request-form.component';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubFormComponent,
    ClubComponent,
    ClubRequestComponent,
    ClubRequestFormComponent
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
    ClubComponent,
    ClubRequestComponent
  ]
})
export class AdministrationModule { }
