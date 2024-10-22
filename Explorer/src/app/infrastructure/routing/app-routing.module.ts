import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProblemComponent } from 'src/app/feature-modules/administration/problem/problem.component';
import { ReportProblemComponent } from 'src/app/feature-modules/tour-execution/report-problem/report-problem.component';
import { TourObjectComponent } from 'src/app/feature-modules/tour-authoring/tour-object/tour-object.component';
import { CheckpointListComponent } from 'src/app/feature-modules/tour-authoring/tour-checkpoint/tour-checkpoint.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthGuard],
  },
  { path: 'problem', component: ProblemComponent },
  { path: 'report-problem', component: ReportProblemComponent },
  { path: 'tourObjects', component: TourObjectComponent, canActivate: [AuthGuard],},
  { path: 'checkpoints', component: CheckpointListComponent},
  { path: 'tour', component: TourComponent},
  { path: 'tourEquipment', component:TourEquipmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
