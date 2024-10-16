import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourComponent } from './tour/tour.component';



@NgModule({
  declarations: [
    TourComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TourComponent
  ]
})
export class TourAuthoringModule { }
