import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './administration/club/club.component';
import { HomeComponent } from './feature-modules/layout/home/home.component';

const routes: Routes = [
  { path: 'club', component: ClubComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }