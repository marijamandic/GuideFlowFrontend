import { AppRating } from './../layout/model/AppRating.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component'; // Import the component
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileInfoFormComponent } from './profile-info-form/profile-info-form.component';
import { ProblemComponent } from './problem/problem.component';
import { AdminProblemComponent } from './admin-problem/admin-problem.component';
import { ClubFormComponent } from './club/club-form/club-form.component';
import { ClubComponent } from './club/club-overview/club.component';
import { ClubRequestComponent } from './club/club-request/club-request.component';
import { ClubRequestFormComponent } from './club/club-request-form/club-request-form.component';
import { ClubInvitationComponent } from './club/club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from './club/club-invitation-form/club-invitation-form.component';
import { ClubMemberListComponent } from 'src/app/feature-modules/administration/club/club-member-list/club-member-list.component';
import { AllAppRatingsComponent } from './all-app-ratings/all-app-ratings.component';
import { LayoutModule } from '../layout/layout.module';
import { AccountComponent } from './account/account.component';
import { ClubPostComponent } from './club/club-post/club-post.component';
import { ClubInfoComponent } from './club/club-info/club-info.component';

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
    AdminProblemComponent,
    AccountComponent,
    ClubPostComponent,
    ClubInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    LayoutModule,
    FormsModule
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
    AdminProblemComponent,
    AccountComponent,
    ClubPostComponent
  ]
})
export class AdministrationModule {}
