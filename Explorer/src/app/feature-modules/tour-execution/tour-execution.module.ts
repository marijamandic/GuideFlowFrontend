import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportProblemComponent } from './report-problem/report-problem.component';

@NgModule({
	declarations: [ReportProblemComponent],
	imports: [CommonModule, ReactiveFormsModule],
	exports: [ReportProblemComponent]
})
export class TourExecutionModule {}
