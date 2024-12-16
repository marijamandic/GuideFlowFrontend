import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Problem } from 'src/app/shared/model/problem.model';
//import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
//import { Account } from '../model/account.model';
import { Category } from 'src/app/shared/model/details.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
//import { adjustProblemsArrayResponse } from 'src/app/shared/utils/adjustResponse';
import { Message } from 'src/app/shared/model/message.model'; // Import poruka modela
import { CreateMessageInput } from '../../tour-authoring/model/create-message-input.model';

@Component({
  selector: 'xp-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent implements OnInit {

  constructor(private authService: AuthService,private service: TourAuthoringService,private tourService: TourService){}
  user: User;
 // users: Account[] = []
  problems: Problem[] = [];
  tours: Tour[] = [];
  problemTourMap: Map<number, boolean> = new Map<number, boolean>();
  selectedProblem: Problem | null = null;
  selectedDate: string = '';
  selectedProblemMessages: Message[] = [];
  newMessageContent: string = '';
  ngOnInit(): void {
    //this.getAccounts();

    this.loadProblems();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
  }
 /* getAccounts() : void {
    this.service.getAccounts().subscribe({
     next: (result: Array<Account>) => {
     this.users = result
     console.log(result);
     },
     error: (err: any) => {
       console.log(err)
     }
   })
 }*/
  loadProblems(): void {
    this.service.getProblemsByAuthorId().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problems = result.results;
        this.fetchAllTours();
        console.log(result);
      },
      error: (err: any) => {
        console.error('Error fetching problems:', err);
      },
    });
  }
  fetchAllTours(): void {
    this.tourService.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.validateProblems();
      },
      error: (err: any) => {
        console.error('Error fetching tours:', err);
      },
    });
  }
  validateProblems(): void {
    this.problems.forEach((problem) => {
      if (problem.id !== undefined) {
        const exists = this.tours.some((tour) => tour.id === problem.tourId);
        this.problemTourMap.set(problem.id, exists);
      }
    });
  }
  getTouristName(userId: number): string {
    //const user = this.users.find((u) => u.userId === userId); // Match with `id` from `Account`
    return this.user.username;
  }
  getTourName(tourId: number): string {
    const tour = this.tours.find((t) => t.id === tourId);
    return tour ? tour.name : 'Unknown Tour';
  }
  getCategoryName(category: Category): string {
    return Category[category] || 'Unknown';
  }

  getProblemStatus(problem: Problem): string {
    const currentDate = new Date();
    const dueDate = new Date(problem.resolution.deadline);
  
    if (problem.resolution.isResolved) {
      return 'Resolved';
    } else if (currentDate > dueDate) {
      return 'Overdue';
    } else {
      return 'Unresolved';
    }
  }
  isDeadlineExpired(deadline: Date): boolean {
    const today = new Date();
    return new Date(deadline) < today; // Returns true if the deadline has passed
  }
  // MODAL
  toggleProblemModal(problem: Problem): void {
    this.selectedProblem = problem;
    this.selectedProblemMessages = problem.messages || [];
  }

  closeProblemModal(): void {
    this.selectedProblem = null;
  }
  updateSelectedDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
  }
  handleSendMessageClick(): void {
    if (!this.selectedProblem) return;
  
    const message: CreateMessageInput = {
      problemId: this.selectedProblem.id!,
      content: this.newMessageContent
    };
  
    this.service.createMessage(message, this.user.role).subscribe({
      next: (result: PagedResults<Message>) => {
        this.selectedProblemMessages = result.results;
        this.selectedProblem!.messages = result.results;
        this.newMessageContent = '';
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
      }
    });
  }

  saveDeadline(): void {
    
  }
}
