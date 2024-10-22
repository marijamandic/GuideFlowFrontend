import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TourReviewComponent, TourReviewFormComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  exports: [
    TourReviewComponent
  ]
})
export class TourExecutionModule { }
