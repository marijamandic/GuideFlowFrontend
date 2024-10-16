import { Component, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
	selector: 'xp-problem',
	templateUrl: './problem.component.html',
	styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
	problems: Problem[] = [];

	constructor(private service: AdministrationService) {}

	ngOnInit(): void {
		this.service.getAllProblems().subscribe({
			next: (result: PagedResults<Problem>) => {
				this.problems = [...result.results];
			}
		});
	}
}
