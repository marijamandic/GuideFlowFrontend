import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubRequestComponent } from './club-request/club-request.component';



@NgModule({
  declarations: [
    ClubRequestComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ClubRequestComponent
  ]
})
export class AdministrationModule { }
