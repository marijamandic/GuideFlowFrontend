import { AppRating } from './../layout/model/AppRating.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component'; // Import the component
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileInfoFormComponent } from './profile-info-form/profile-info-form.component';
import { ProblemComponent } from './problem/problem.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubComponent } from './club/club.component';
import { ClubRequestComponent } from './club-request/club-request.component';
import { ClubRequestFormComponent } from './club-request-form/club-request-form.component';
import { ClubInvitationComponent } from './club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from './club-invitation-form/club-invitation-form.component';
import { ClubMemberListComponent } from 'src/app/feature-modules/administration/club-member-list/club-member-list.component';
import { AllAppRatingsComponent } from './all-app-ratings/all-app-ratings.component';
import { LayoutModule } from '../layout/layout.module';
import { AccountComponent } from './account/account.component';
import { ClubPostComponent } from './club-post/club-post.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ProfileInfoComponent,
    ProfileInfoFormComponent,
    ClubFormComponent,
    ClubComponent,
    ClubRequestComponent,
    ClubRequestFormComponent,
    ClubInvitationComponent,
    ClubInvitationFormComponent,
    ClubMemberListComponent,
    ProblemComponent,
    AllAppRatingsComponent,
    ProblemComponent,
    AccountComponent,
    ClubPostComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ProfileInfoComponent,
    ClubFormComponent,
    ClubComponent,
    ClubRequestComponent,
    ClubInvitationComponent,
    ClubInvitationFormComponent,
    ClubMemberListComponent,
    ProblemComponent,
    AllAppRatingsComponent,
    AccountComponent,
    ClubPostComponent
  ]
})
export class AdministrationModule {}
