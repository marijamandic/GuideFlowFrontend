import { Component } from '@angular/core';
import { Problem, Category, Priority, categoryToStringArray, priorityToStringArray } from 'src/app/shared/model/problem.model';
import { TourExecutionService } from '../tour-execution.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toDateOnly } from 'src/app/utils/dateToDateOnlyConverter';

@Component({
	selector: 'xp-report-problem',
	templateUrl: './report-problem.component.html',
	styleUrls: ['./report-problem.component.css']
})
export class ReportProblemComponent {
	problemInput = new FormGroup({
		category: new FormControl(Category.Accommodation, [Validators.required]),
		priority: new FormControl(Priority.High, [Validators.required]),
		description: new FormControl('', [Validators.required])
	});

	categories = [...categoryToStringArray()];
	priorities = [...priorityToStringArray()];

	constructor(private service: TourExecutionService) {}

	handleClick(): void {
		let problem: Problem = {
			userId: 1,
			tourId: 1,
			category: this.problemInput.value.category ? +this.problemInput.value.category : 0,
			priority: this.problemInput.value.priority ? +this.problemInput.value.priority : 0,
			description: this.problemInput.value.description || '',
			reportedAt: toDateOnly(new Date())
		};

		this.service.createProblem(problem).subscribe({
			next: (problem: Problem) => {
				console.log(problem);
			}
		});
	}
}
