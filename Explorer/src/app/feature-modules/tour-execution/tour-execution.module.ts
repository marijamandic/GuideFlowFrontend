import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportProblemComponent } from './report-problem/report-problem.component';

@NgModule({
  declarations: [ReportProblemComponent],
  imports: [CommonModule, FormsModule],
  exports: [ReportProblemComponent],
})
export class TourExecutionModule {}
