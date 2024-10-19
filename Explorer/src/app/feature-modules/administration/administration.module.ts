import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubComponent } from './club/club.component';


import { ClubInvitationComponent } from './club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from './club-invitation-form/club-invitation-form.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubFormComponent,
    ClubComponent,
    ClubInvitationComponent,
    ClubInvitationFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubFormComponent,
    ClubComponent,
    ClubInvitationComponent,
    ClubInvitationFormComponent,
  ]
})
export class AdministrationModule { }
