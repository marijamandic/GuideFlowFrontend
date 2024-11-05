import { Component, OnInit } from '@angular/core';
import { Problem } from 'src/app/shared/model/problem.model';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Category } from 'src/app/shared/model/details.model';
import { Priority } from 'src/app/shared/model/details.model';
import { ProblemStatus } from '../model/problem-status.model';

@Component({
    selector: 'xp-problem-status',
	templateUrl: './problem-status.component.html',
	styleUrls: ['./problem-status.component.css']
})

export class ProblemStatusComponent implements OnInit {
    problems: Problem[] = [];
    idOfUser: number = 0;
    selectedProblemId: number | null = null;

    statusUpdate = {
        isResolved: null as boolean | null,
        message: ''
    };

    constructor(private service: TourExecutionService, private authSerivce: AuthService) {}

    ngOnInit(): void {
        this.authSerivce.user$.subscribe(user => {
            this.idOfUser = user.id;
          })
        this.getAllProblems();
    }

    getAllProblems(): void {
        this.service.getUserProblems(this.idOfUser).subscribe({
            next: (result: PagedResults<Problem>) => {
                this.problems = result.results;
                console.log(result.results);
            },
            error: (err: any) => {
                console.log(err)
            }
        })
    }

    getCategoryName(category: Category): string {
        return Category[category];
    }

    getPriorityName(priority: Priority): string {
        return Priority[priority];
    }

    formatDate(date: Date): string {
        const parsedDate = date instanceof Date ? date : new Date(date);
        return parsedDate.toISOString().split('T')[0];
    }

    toggleForm(problemId: number | null): void {
        this.selectedProblemId = this.selectedProblemId === problemId ? null : problemId;
        this.statusUpdate = { isResolved: null, message: '' };
    }

    updateResolvedStatus(isResolved: boolean): void {
        this.statusUpdate.isResolved = isResolved;
    }

    updateMessage(event: Event): void {
        const inputElement = event.target as HTMLTextAreaElement;
        this.statusUpdate.message = inputElement.value;
    }

    canSubmit(): boolean {
        return (
            this.statusUpdate.message.trim() !== '' && 
            this.statusUpdate.isResolved !== null
        );
    }

    submitUpdate(problemId: number): void {
        if (this.canSubmit()) {
            //console.log(`Problem ID: ${problemId}, Resolved: ${this.statusUpdate.isResolved}, Message: ${this.statusUpdate.message}`);
            const problemStatus : ProblemStatus = {
                isSolved : this.statusUpdate.isResolved as boolean,
                touristMessage : this.statusUpdate.message
            }
            //console.log(problemStatus)
            this.service.changeProblemStatus(problemId,problemStatus).subscribe({
                next: (result : Problem) => {
                    const index = this.problems.findIndex(p => p.id === problemId);
                    if (index !== -1) {
                    this.problems[index] = result;
                }
                },
                error: (err : any) => {
                    console.log(err);
                }
            })
            this.toggleForm(null);
        }
    }
}
