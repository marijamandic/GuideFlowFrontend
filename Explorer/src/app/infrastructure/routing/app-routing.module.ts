import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubComponent } from 'src/app/feature-modules/administration/club/club.component';
import { ClubInvitationComponent } from 'src/app/feature-modules/administration/club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from 'src/app/feature-modules/administration/club-invitation-form/club-invitation-form.component';
import { ClubRequestComponent } from 'src/app/feature-modules/administration/club-request/club-request.component';
import { ClubRequestFormComponent } from 'src/app/feature-modules/administration/club-request-form/club-request-form.component';
import { ClubMemberListComponent } from 'src/app/feature-modules/administration/club-member-list/club-member-list.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'club', component: ClubComponent, canActivate: [AuthGuard],},
  {path: 'club-invitation', component: ClubInvitationComponent, canActivate: [AuthGuard],},
  {path: 'club-invitation/add', component: ClubInvitationFormComponent, canActivate: [AuthGuard], },
  {path: 'club-invitation/edit/:id', component: ClubInvitationFormComponent, canActivate: [AuthGuard], },
  {path: 'club-request', component: ClubRequestComponent, canActivate: [AuthGuard],},
  {path: 'club-request/add', component: ClubRequestFormComponent, canActivate: [AuthGuard],},
  {path: 'club-members/:id', component: ClubMemberListComponent, canActivate: [AuthGuard],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
