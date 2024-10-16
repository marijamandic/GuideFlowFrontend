import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubInvitationComponent } from './club-invitation/club-invitation.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubInvitationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubInvitationComponent
  ]
})
export class AdministrationModule { }
