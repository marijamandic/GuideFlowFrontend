import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileInfoComponent } from 'src/app/feature-modules/administration/profile-info/profile-info.component';
import { EquipmentManagementComponent } from 'src/app/feature-modules/tour-execution/equipment-management/equipment-management.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'profileInfo', component: ProfileInfoComponent},
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard], },
  { path: 'equipmentManagement', component: EquipmentManagementComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
