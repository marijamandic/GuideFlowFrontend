import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { Tourist } from '../model/tourist';

@Component({
  selector: 'xp-problem-info',
  templateUrl: './problem-info.component.html',
  styleUrls: ['./problem-info.component.css']
})
export class ProblemInfoComponent implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer: ElementRef;
  users: Account[] = []
  user: User;
  opositeUser : User;
  otherUser : User;
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
    if(this.user !== null && this.user.role !== 'administrator'){
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
  loadUser(): void {
    if (!this.problem || !this.user) {
      console.error('Error: problem or user is undefined');
      return;
    }

    if (this.problem.userId === this.user.id) {
      // Ako je ulogovan turist (problem.userId === user.id), dobavi autora ture
      if (this.tour?.authorId) {
        
        this.tourService.getUserById(this.tour.authorId).subscribe({
          next: (result: User) => {
            this.opositeUser = result;
          },
          error: (err) => {
            console.error('Error fetching author username:', err);
          }
        });
      }
    } else {
      // Ako je ulogovan autor ture, dobavi turista koji je prijavio problem
      this.tourService.getUserById(this.problem.userId).subscribe({
        next: (result: User) => {
          this.opositeUser = result;
        },
        error: (err) => {
          console.error('Error fetching tourist username:', err);
        }
      });
    }
  }
  loadTour(tourId: number): void {
    this.tourService.getTourById(tourId).subscribe({
      next: (result : Tour) => {
        this.tour = result;
        this.loadUser();
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
      }
    });
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
    if (this.problem !== null) {
      // Dodaj opis kao prvu poruku
      const descriptionMessage: Message = {
        id: 0,
        problemId: this.problem.id!,
        userId: this.problem.userId,
        content: this.problem.details.description,
        postedAt: this.problem.resolution?.reportedAt || new Date()
      };
  
      // Ubaci opis kao prvu poruku i dodaj ostale poruke
      this.selectedProblemMessages = [descriptionMessage, ...(this.problem.messages || [])];
    }
  }
  handleSendMessageClick(): void {
    if (!this.newMessageContent.trim()) {
      return;
    }
    this.selectedProblem = this.problem;
      if (!this.selectedProblem) return;
    
      const message: CreateMessageInput = {
        problemId: this.selectedProblem.id!,
        content: this.newMessageContent
      };

      this.service.createMessage(message, this.user.role).subscribe({
        next: (result: PagedResults<Message>) => {
          const descriptionMessage: Message = {
            id: 0,
            problemId: this.problem?.id!,
            userId: this.problem?.userId ?? 0,
            content: this.problem?.details.description ?? 'No description',
            postedAt: this.problem?.resolution?.reportedAt || new Date()
          };
    
          // Ažuriraj poruke sa dodanim opisom
          this.selectedProblemMessages = [
            descriptionMessage,
            ...result.results
          ];
    
          this.selectedProblem!.messages = result.results;
          this.newMessageContent = '';
          this.scrollToBottom();
        },
        error: (err: any) => {
          console.error('Error sending message:', err);
        }
      });
  }
  hasPermission(): boolean {
    return this.user?.role === 'tourist' || this.user?.role === 'author';
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
}
