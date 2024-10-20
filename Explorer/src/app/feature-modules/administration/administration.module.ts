import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubComponent } from './club/club.component';
import { ClubRequestComponent } from './club-request/club-request.component';
import { ClubRequestFormComponent } from './club-request-form/club-request-form.component';

import { ClubInvitationComponent } from './club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from './club-invitation-form/club-invitation-form.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubFormComponent,
    ClubComponent,
    ClubRequestComponent,
    ClubRequestFormComponent,
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
    ClubRequestComponent,
    ClubInvitationComponent,
    ClubInvitationFormComponent,
  ]
})
export class AdministrationModule { }
