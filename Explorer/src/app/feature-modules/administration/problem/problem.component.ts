import { Component, OnInit } from '@angular/core';
import { Problem, Category, Priority } from 'src/app/shared/model/problem.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
	selector: 'xp-problem',
	templateUrl: './problem.component.html',
	styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
	problems: Problem[] = [];
	category = 'category';
	priority = 'priority';

	constructor(private service: AdministrationService) {}

	getEnumtring(enumValue: number, type: string): string {
		return type === this.category ? Category[enumValue] : Priority[enumValue];
	}

	ngOnInit(): void {
		this.service.getAllProblems().subscribe({
			next: (result: PagedResults<Problem>) => {
				this.problems = [...result.results];
			}
		});
	}
}
