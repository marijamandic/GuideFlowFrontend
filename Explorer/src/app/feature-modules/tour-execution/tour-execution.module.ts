import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReportProblemComponent } from './report-problem/report-problem.component';



import { TourReviewComponent } from './tour-review/tour-review.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { TourExecutionDetailsComponent } from './tour-execution-details/tour-execution-details.component';

@NgModule({
  declarations: [
    EquipmentManagementComponent,
    EquipmentFormComponent,
    ReportProblemComponent,
	TourReviewComponent,
	TourReviewFormComponent,
 TourExecutionDetailsComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule
  ],
  exports:
  [
    EquipmentManagementComponent,
    ReportProblemComponent,
	TourReviewComponent
  ],
})
export class TourExecutionModule {}
