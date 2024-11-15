import { Component, OnInit } from '@angular/core';
import { CreateProblemInput } from '../model/create-problem-input.model';
import { Category, Priority, categoryToStringArray, priorityToStringArray } from 'src/app/shared/model/details.model';
import { TourExecutionService } from '../tour-execution.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toDateOnly } from 'src/app/shared/utils/dateToDateOnlyConverter';
import { Problem } from 'src/app/shared/model/problem.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
	selector: 'xp-report-problem',
	templateUrl: './report-problem.component.html',
	styleUrls: ['./report-problem.component.css']
})
export class ReportProblemComponent implements OnInit {
	user: User;

	problemInput = new FormGroup({
		category: new FormControl(Category.Accommodation, [Validators.required]),
		priority: new FormControl(Priority.High, [Validators.required]),
		description: new FormControl('', [Validators.required])
	});

	categories = [...categoryToStringArray()];
	priorities = [...priorityToStringArray()];

	constructor(private tourExecutionService: TourExecutionService, private authService: AuthService) {}

	subscribeUser() {
		this.authService.user$.subscribe((user: User) => {
			this.user = { ...user };
		});
	}

	handleClick(): void {
		let problem: CreateProblemInput = {
			userId: this.user.id,
			tourId: 1,
			category: this.problemInput.value.category ? +this.problemInput.value.category : 0,
			priority: this.problemInput.value.priority ? +this.problemInput.value.priority : 0,
			description: this.problemInput.value.description || ''
		};

		this.tourExecutionService.createProblem(problem).subscribe({
			next: (problem: Problem) => {
				console.log(problem);
			}
		});
	}

	ngOnInit(): void {
		this.subscribeUser();
	}
}
