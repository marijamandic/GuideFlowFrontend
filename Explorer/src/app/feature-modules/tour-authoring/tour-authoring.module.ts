import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourObjectComponent } from './tour-object/tour-object.component';



@NgModule({
  declarations: [
    TourObjectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TourObjectComponent
  ]
})
export class TourAuthoringModule { }
