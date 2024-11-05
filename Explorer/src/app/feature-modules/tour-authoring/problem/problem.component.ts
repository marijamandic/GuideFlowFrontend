import { Component, OnInit } from '@angular/core';
import { Problem } from 'src/app/shared/model/problem.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { convertEnumToString } from 'src/app/shared/utils/enumToStringConverter';
import { toDateOnly } from 'src/app/shared/utils/dateToDateOnlyConverter';
import { adjustProblemsArrayResponse } from 'src/app/shared/utils/adjustResponse';

@Component({
	selector: 'xp-problem',
	templateUrl: './problem.component.html',
	styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
	problems: Problem[] = [];

	constructor(private service: TourAuthoringService) {}

	toString(value: number, type: string) {
		return convertEnumToString(value, type);
	}

	toDateOnly(date: Date) {
		return toDateOnly(date);
	}

	ngOnInit(): void {
		this.service.getProblemsByAuthorId().subscribe({
			next: (result: PagedResults<Problem>) => {
				this.problems = adjustProblemsArrayResponse(result.results);
			}
		});
	}
}
