import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubComponent } from './club/club.component';



@NgModule({
  declarations: [
    ClubComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ClubComponent
  ]
})
export class AdministrationModule { }
