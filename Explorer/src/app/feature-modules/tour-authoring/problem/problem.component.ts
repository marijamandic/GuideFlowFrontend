import { Component, OnInit } from '@angular/core';
import { Problem } from 'src/app/shared/model/problem.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { convertEnumToString } from 'src/app/shared/utils/enumToStringConverter';
import { toDateOnly } from 'src/app/shared/utils/dateToDateOnlyConverter';
import { adjustProblemsArrayResponse } from 'src/app/shared/utils/adjustResponse';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Location } from '@angular/common';

@Component({
	selector: 'xp-problem',
	templateUrl: './problem.component.html',
	styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
	problems: Problem[] = [];
	currentProblem: Problem | undefined;
	user: User;

	constructor(private tourAuthoringService: TourAuthoringService, private authService: AuthService, private location: Location) {}

	subscribeUser() {
		this.authService.user$.subscribe((user: User) => {
			this.user = user;
		});
	}

	getInitialData() {
		if (this.user.role === 'author') {
			this.tourAuthoringService.getProblemsByAuthorId().subscribe({
				next: (result: PagedResults<Problem>) => {
					this.problems = adjustProblemsArrayResponse(result.results);
					this.getState();
				}
			});
		}

		if (this.user.role === 'tourist') {
			this.tourAuthoringService.getProblemsByTouristId().subscribe({
				next: (result: PagedResults<Problem>) => {
					this.problems = adjustProblemsArrayResponse(result.results);
					this.getState();
				}
			});
		}
	}

	getState() {
		const navigation = this.location.getState() as { problemId: number };
		if (navigation && navigation.problemId) {
			this.currentProblem = this.problems.find(p => p.id === navigation.problemId);
		}
	}

	toString(value: number, type: string) {
		return convertEnumToString(value, type);
	}

	toDateOnly(date: Date) {
		return toDateOnly(date);
	}

	handleViewClick(problemId: number) {
		this.currentProblem = this.problems.find(p => p.id === problemId);
	}

	handleMessageAdded(problem: Problem) {
		let updateProblem = this.problems.find(p => p.id === problem.id);
		if (updateProblem) {
			Object.assign(updateProblem, problem);
		}
	}

	ngOnInit(): void {
		this.subscribeUser();
		this.getInitialData();
	}
}
