import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/layout/home/home.component';
import { LoginComponent } from './infrastructure/auth/login/login.component';
import { RegistrationComponent } from './infrastructure/auth/registration/registration.component';
import { EquipmentComponent } from './feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from './infrastructure/auth/auth.guard';
import { ClubComponent } from './feature-modules/administration/club/club.component';
import { ClubRequestComponent } from './feature-modules/administration/club-request/club-request.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'club', component: ClubComponent, canActivate: [AuthGuard],},
  { path: 'home', component: HomeComponent },
  { path: 'clubRequest', component: ClubRequestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
