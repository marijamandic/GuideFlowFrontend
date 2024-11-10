import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Problem } from 'src/app/shared/model/problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Category } from 'src/app/shared/model/details.model';
import { Priority } from 'src/app/shared/model/details.model';

@Component({
	selector: 'xp-admin-problem',
	templateUrl: './admin-problem.component.html',
	styleUrls: ['./admin-problem.component.css']
})
export class AdminProblemComponent implements OnInit {
    problems: Problem[] = [];
    selectedProblemId: number | null = null;
    selectedDate: string = '';

    constructor(private service: AdministrationService) { }

    ngOnInit(): void {
        this.service.getProblems().subscribe({
            next: (result: PagedResults<Problem>) => {
                this.problems = result.results;
            },
            error: (err: any) => {
                console.log(err);
            }
        });
    }

    getCategoryName(category: Category): string {
        return Category[category];
    }

    getPriorityName(priority: Priority): string {
        return Priority[priority];
    }

    formatDate(date: Date): string {
		const parsedDate = new Date(date);
		return parsedDate.toLocaleDateString('en-CA');
	}

    toggleDatePicker(problemId: number): void {
		this.selectedProblemId = this.selectedProblemId === problemId ? 0 : problemId;
		this.selectedDate = '';
	}
    getMinDate(currentDeadline: Date): string {
        const today = new Date();
        const deadlineDate = new Date(currentDeadline);
        return today > deadlineDate ? this.formatDate(today) : this.formatDate(deadlineDate);
    }

    updateSelectedDate(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.selectedDate = inputElement.value;
    }

    saveDeadline(problemId: number): void {
		if (this.selectedDate) {
			const dateParts = this.selectedDate.split('-');
			const localDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
	
			const year = localDate.getFullYear();
			const month = String(localDate.getMonth() + 1).padStart(2, '0');
			const day = String(localDate.getDate()).padStart(2, '0');
			const hours = String(localDate.getHours()).padStart(2, '0');
			const minutes = String(localDate.getMinutes()).padStart(2, '0');
			const seconds = String(localDate.getSeconds()).padStart(2, '0');
	
			const timeZoneOffset = -localDate.getTimezoneOffset();
			const offsetHours = Math.floor(Math.abs(timeZoneOffset) / 60);
			const offsetMinutes = Math.abs(timeZoneOffset) % 60;
			const offsetSign = timeZoneOffset >= 0 ? '+' : '-';
	
			const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
			
			console.log(`Saving new deadline for problem ${problemId}: ${formattedDate}`);
	
			this.service.updateDeadline(problemId, formattedDate).subscribe({
				next: (result: Problem) => {
					const index = this.problems.findIndex(p => p.id === problemId);
					if (index !== -1) {
						this.problems[index] = result;
					}
				},
				error: (err: any) => {
					console.log(err);
				}
			});
			
			this.toggleDatePicker(0);
		}
	}
	isDeadlineExpired(deadline: Date): boolean {
        const today = new Date();
        return new Date(deadline) < today;
    }

    cancelDeadline(): void {
        this.toggleDatePicker(0);
    }
}
