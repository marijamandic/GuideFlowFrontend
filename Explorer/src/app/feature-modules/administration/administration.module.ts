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
import { AllAppRatingsComponent } from './all-app-ratings/all-app-ratings.component';
import { LayoutModule } from '../layout/layout.module';
import { AdminDashboardComponenet } from './admin-dashboard/admin-dashboard.component';
import { ClubPostComponent } from './club/club-post/club-post.component';
import { ClubInfoComponent } from './club/club-info/club-info.component';
import { ClubDashboardComponent } from './club/club-dashboard/club-dashboard.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ProfileInfoComponent,
    ProfileInfoFormComponent,
    ClubFormComponent,
    ClubComponent,
    ProblemComponent,
    AllAppRatingsComponent,
    ProblemComponent,
    AdminProblemComponent,
    AdminDashboardComponenet,
    ClubPostComponent,
    ClubInfoComponent,
    ClubDashboardComponent,
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
    ProblemComponent,
    AllAppRatingsComponent,
    AdminProblemComponent,
    AdminDashboardComponenet,
    ClubPostComponent
  ]
})
export class AdministrationModule {}
