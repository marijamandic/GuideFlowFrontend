import { Component, OnInit } from '@angular/core';
import { Account, UserRole } from '../model/account.model'
import { AdministrationService } from '../administration.service';
import { LayoutService } from '../../layout/layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Problem } from 'src/app/shared/model/problem.model';
import { Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { TourService } from '../../tour-authoring/tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Category } from 'src/app/shared/model/details.model';

@Component({
  selector: 'xp-account',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponenet implements OnInit {

users: Account[] = []
  public UserRole = UserRole;
  roles = {
    0: 'Admin',
    1: 'Author',
    2: 'Tourist'
  } as const;
  selectedAccountId: number | null = null;
  moneyInput: number = 0;
  user: User;
  clicked: boolean = false;
  problems: Problem[] = [];
  tours: Tour[] = [];
  problemTourMap: Map<number, boolean> = new Map<number, boolean>();
  selectedProblem: Problem | null = null;
  selectedDate: string = '';

  constructor(
    private service: AdministrationService, 
    private notificationService: LayoutService, 
    private authService: AuthService,
    private tourService: TourService) {}
  
  getRoleLabel(role: number): string {
    return this.roles[role as keyof typeof this.roles] || 'Unknown';
  }
  
  ngOnInit(): void {
    this.getAccounts();
    this.loadProblems();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
  }

  getAccounts() : void {
     this.service.getAccounts().subscribe({
      next: (result: Array<Account>) => {
      this.users = result
      console.log(result);
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  getUsername(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown User';
  }
  
  // BAN
  ToggleAcountActivty(account : Account) : void {

    this.service.toggleAcountActivity(account).subscribe({
      error: (err: any) => {
        console.log(err)
      }
    })

    account.isActive = account.isActive ? false : true
  }

  // ADD MONEY
  toggleMoneyInput(user: Account): void {
    console.log('Clicked user:', user);
    if (this.selectedAccountId === user.id) { 
      this.selectedAccountId = null;
      this.moneyInput = 0;
    } else {
      this.selectedAccountId = user.id; 
      this.moneyInput = 0;
    }
    console.log('Updated selectedAccountId:', this.selectedAccountId);
  }
  
  closeModal(): void {
    this.selectedAccountId = null; 
    this.moneyInput = 0; 
  }

  depositMoney(): void {
    if (this.moneyInput <= 0) {
      alert('Please enter a valid amount');
      return;
    }
  
    const account = this.users.find((user) => user.id === this.selectedAccountId); // Use userId if required
    if (!account) {
      alert('Invalid account selected');
      return;
    }
  
    console.log('Sending updateMoney request:', account.id, this.moneyInput);
  
    this.service.updateMoney(account.id, this.moneyInput).subscribe({
      next: () => {
        alert(`Successfully added ${this.moneyInput} AC to ${account.username}`);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error depositing money:', err);
      },
    });
  }  

  // PROBLEMS
  // PROBLEMS
  loadProblems(): void {
    this.service.getProblems().subscribe({
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

  isTourAvailable(problemId: number): boolean {
    return this.problemTourMap.get(problemId) ?? false;
  }

  getTouristName(userId: number): string {
    const user = this.users.find((u) => u.id === userId); // Match with `id` from `Account`
    return user ? user.username : 'Unknown User';
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

  // MODAL
  toggleProblemModal(problem: Problem): void {
    this.selectedProblem = problem;
  }

  closeProblemModal(): void {
    this.selectedProblem = null;
  }

  updateSelectedDate(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedDate = inputElement.value;
  }

  saveDeadline(): void {
    if (this.selectedProblem && this.selectedDate) {
      const problemId = this.selectedProblem.id;
  
      if (problemId !== undefined) {
        console.log('Saving deadline:', { problemId, selectedDate: this.selectedDate });
        this.service.updateDeadline(problemId, this.selectedDate).subscribe({
          next: (updatedProblem) => {
            console.log('Deadline saved successfully:', updatedProblem);
            this.selectedProblem = updatedProblem;
            this.closeProblemModal(); 
          },
          error: (err) => {
            console.error('Error saving deadline:', err);
          },
        });
      } else {
        console.error('Problem ID is undefined');
      }
    } else {
      console.error('Selected problem or date is missing:', { selectedProblem: this.selectedProblem, selectedDate: this.selectedDate });
    }
  }
  
  archiveTour(tourId: number): void {
    this.tourService.getTourById(tourId).subscribe({
      next: (tour) => {
        tour.status = TourStatus.Archived; // Treba dodati notifikaciju koja se salje i turisti i ovog levog.
        this.selectedProblem!.resolution.isResolved = true; 
        this.tourService.updateTour(tour).subscribe({
          next: () => {
            console.log('Tour successfully archived.');
            this.closeProblemModal(); // Close the modal after archiving
          },
          error: (err) => console.error('Error archiving tour:', err),
        });
      },
      error: (err) => console.error('Error fetching tour by ID:', err),
    });
  }
 
  isDeadlineExpired(deadline: Date): boolean {
    const today = new Date();
    return new Date(deadline) < today; // Returns true if the deadline has passed
  }
  

}


