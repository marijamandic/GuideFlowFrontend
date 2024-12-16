import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Problem } from 'src/app/shared/model/problem.model';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { Account } from '../../administration/model/account.model';
import { AdministrationService } from '../../administration/administration.service';
import { Category } from 'src/app/shared/model/details.model';
import { Message } from 'src/app/shared/model/message.model';
import { CreateMessageInput } from '../model/create-message-input.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-problem-info',
  templateUrl: './problem-info.component.html',
  styleUrls: ['./problem-info.component.css']
})
export class ProblemInfoComponent implements OnInit {

  users: Account[] = []
  user: User;
  currentTourist : User | null = null;
  problemId : number = 0;
  tour: Tour | null = null;
  problem: Problem | null = null;
  selectedProblemMessages: Message[] = [];
  newMessageContent: string = '';
  selectedProblem: Problem | null = null;
  constructor(
    private authService: AuthService,
    private  service: TourAuthoringService,
    private route: ActivatedRoute,
    private tourService: TourService,
    private adminService: AdministrationService
    ){}
  ngOnInit(): void {
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
    this.problemId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.loadProblem();
  }
  loadProblem() : void{
    if(this.user !== null ){
      this.service.getProblemById(this.problemId,this.user?.role).subscribe({
        next: (result: Problem) => {
          this.problem = result;
          if (result.id !== undefined) {
            this.loadTour(result.id);
            this.loadMessages();
          }
          else {
            console.error('Error: result.id is undefined');
          }
        },
        error: (err: any) => {
          console.error('Error fetching problems:', err);
        },
      });
    }
  }
  loadTour(tourId: number): void {
    this.tourService.getTourById(tourId).subscribe({
      next: (result : Tour) => {
        this.tour = result;
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
      }
    });
  }
  /*getTourName(tourId: number): string {
    const tour = this.tours?.find((t) => t.id === tourId);
    return tour ? tour.name : 'Unknown Tour';
  }*/
  
    getTouristName(): string {
     /* const userId = this.problem?.userId || 0;
      if (userId > 0) {
        this.authService.getUserById(userId).subscribe({
          next: (user: User) => {
            this.currentTourist = user;
            return this.currentTourist.username;
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            return 'Undefined'
          }
        });
        return 'Undefined';
      }*/
     return 'None';
    }
    
  
  getCategoryName(): string {
    if(this.problem !== null){
      return Category[this.problem?.details.category] || 'Unknown';
    }
    return 'Unknown';
  }
  
  getProblemStatus(): string {
    if(this.problem !== null){
      const currentDate = new Date();
      const dueDate = new Date(this.problem.resolution.deadline);
    
      if (this.problem.resolution.isResolved) {
        return 'Resolved';
      } else if (currentDate > dueDate) {
        return 'Overdue';
      } else {
        return 'Unresolved';
      }
    }
    return 'None';
  }
  loadMessages(): void {
    if(this.problem !== null){
      this.selectedProblemMessages = this.problem.messages || [];
    }
  }
  handleSendMessageClick(): void {
    this.selectedProblem = this.problem;
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
}
