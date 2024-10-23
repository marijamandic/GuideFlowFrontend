import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReportProblemComponent } from './report-problem/report-problem.component';




@NgModule({
  declarations: [
    EquipmentManagementComponent,
    EquipmentFormComponent,
    ReportProblemComponent
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
    ReportProblemComponent
  ]
})
export class TourExecutionModule {}
