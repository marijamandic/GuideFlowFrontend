import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';



@NgModule({
  declarations: [
    TourReviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TourReviewComponent
  ]
})
export class TourExecutionModule { }
