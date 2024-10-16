import { Component } from '@angular/core';
import { Problem } from '../model/problem.model';
import { CATEGORIES, PRIORITIES } from '../constants/report-problem.constants';
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
		category: new FormControl('', [Validators.required]),
		priority: new FormControl('', [Validators.required]),
		description: new FormControl('', [Validators.required])
	});

	categories = [...CATEGORIES];
	priorities = [...PRIORITIES];

	constructor(private service: TourExecutionService) {}

	handleClick(): void {
		let problem: Problem = {
			userId: 1,
			tourId: 1,
			category: this.problemInput.value.category || '',
			priority: this.problemInput.value.category || '',
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
