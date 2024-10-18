import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubInvitationComponent } from 'src/app/feature-modules/administration/club-invitation/club-invitation.component';
import { ClubInvitationFormPageComponent } from 'src/app/feature-modules/administration/club-invitation-form-page/club-invitation-form-page.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'club-invitation', component: ClubInvitationComponent, canActivate: [AuthGuard],},
  {path: 'club-invitation/add', component: ClubInvitationFormPageComponent, canActivate: [AuthGuard], },
  {path: 'club-invitation/edit/:id', component: ClubInvitationFormPageComponent, canActivate: [AuthGuard], },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
