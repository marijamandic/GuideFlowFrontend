import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { AdministrationService } from '../administration.service';
import { Tourist } from '../../tour-authoring/model/tourist';

@Component({
  selector: 'xp-author-dashboard',
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css']
})
export class AuthorDashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private service: TourAuthoringService,
    private tourService: TourService,
    private administrationService: AdministrationService
  ){}

  Math = Math;
  user: User;
  @ViewChild('messagesContainer') private messagesContainer: ElementRef
  // users: Account[] = []
  problems: Problem[] = [];
  tours: Tour[] = [];
  currentTourist : Tourist;
  problemTourMap: Map<number, boolean> = new Map<number, boolean>();
  selectedProblem: Problem | null = null;
  selectedDate: string = '';
  selectedProblemMessages: Message[] = [];
  newMessageContent: string = '';
  averageGrade: number = 0;
  reviewsPartition: { [key: number]: number } = {};

  ngOnInit(): void {
    this.loadProblems();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
    this.loadAverageGrade(this.user.id); 
    this.loadReviewsPartition(this.user.id);
  }

  // ■■■■■ Reviews sections ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  loadAverageGrade(authorId: number): void {
    this.administrationService.getAverageGradeForAuthor(authorId).subscribe({
      next: (result) => {
        this.averageGrade = result;
        // console.log(result);
      },
      error: (err) => {
        console.error('Error fetching average grade:', err);
      },
    });
  }
  
  loadReviewsPartition(authorId: number): void {
    this.administrationService.getReviewsPartitionedByGrade(authorId).subscribe({
      next: (result) => {
        this.reviewsPartition = result;
        // console.log(result);
      },
      error: (err) => {
        console.error('Error fetching reviews partition:', err);
      },
    });
  }

  getTotalRatings(): number {
    return Object.values(this.reviewsPartition).reduce((sum, count) => sum + count, 0);
  }
  
  getRatingPercentage(grade: number): number {
    const total = this.getTotalRatings();
    if (total === 0) return 0;
    return Math.round((this.reviewsPartition[grade] || 0) / total * 100);
  }

  // ■■■■■ Problems table ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  loadProblems(): void {
    this.service.getProblemsByAuthorId().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.problems = result.results;
        this.fetchAllTours();
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
    return new Date(deadline) < today; 
  }

  toggleProblemModal(problem: Problem): void {
    this.selectedProblem = problem;

    const problemDescriptionMessage: Message = {
        id: 0,
        problemId: problem.id!,
        userId: problem.userId,
        content: problem.details.description,
        postedAt: problem.resolution?.reportedAt || new Date()
    };

    this.selectedProblemMessages = [problemDescriptionMessage, ...(problem.messages || [])];
    this.loadCurrentTourist(problem.userId);
  }
  loadCurrentTourist(touristId : number){
    this.tourService.getTouristById(touristId).subscribe({
      next: (result: Tourist) => {
        this.currentTourist = result;
      },
      error: (err) => {
        console.error('Error fetching tourist username:', err);
      }
    });
  }
  closeProblemModal(): void {
    this.selectedProblem = null;
  }

  updateSelectedDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
  }

  handleSendMessageClick(): void {
    if (!this.newMessageContent.trim()) {
      return;
    }
    if (!this.selectedProblem) return;
  
    const message: CreateMessageInput = {
      problemId: this.selectedProblem.id!,
      content: this.newMessageContent
    };
  
    this.service.createMessage(message, this.user.role).subscribe({
      next: (result: PagedResults<Message>) => {
        //Deskripcija
        const problemDescriptionMessage: Message = {
          id: 0,
          problemId: this.selectedProblem!.id!,
          userId: this.selectedProblem!.userId,
          content: this.selectedProblem!.details.description,
          postedAt: new Date(this.selectedProblem!.resolution.reportedAt)
      };

      // Kombinovanje opisa i novih poruka
      this.selectedProblemMessages = [
          problemDescriptionMessage,
          ...result.results
      ];

      // Azuriranje poruka problema
      this.selectedProblem!.messages = [
          problemDescriptionMessage,
          ...result.results
      ];

      this.newMessageContent = '';
      this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
      }
    });
  }
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  saveDeadline(): void {
    
  }
}
