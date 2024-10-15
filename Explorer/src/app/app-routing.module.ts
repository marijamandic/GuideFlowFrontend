import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ClubRequestComponent } from './administration/club-request/club-request.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'clubRequest', component: ClubRequestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
