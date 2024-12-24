import { Component, OnInit } from '@angular/core';
import { PurchasedTours } from '../model/purchased-tours.model';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { CreateTourExecutionDto } from '../model/create-tour-execution.dto';
import { environment } from 'src/env/environment';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Category, Priority, categoryToStringArray, priorityToStringArray, Details } from 'src/app/shared/model/details.model';
import { CreateProblemInput } from '../model/create-problem-input.model';
import { Problem } from 'src/app/shared/model/problem.model';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit{
  purchasedTours: Tour[] = [];
  incompleteTours: Tour[] = [];
  completedTours: Tour[] = [];
  completedTourIds: number[] = [];
  message: string = '';
  selectedPurchasedTour: PurchasedTours;
  tourExecutionId : string | null=null;
  user: User | undefined;
  tourExecution: TourExecution | null=null;
  activeTourExecution: TourExecution | null = null;
  dto: CreateTourExecutionDto = {
    TourId : 0,
    UserId: 0
  };
  INCOMPLETE_PRODUCT = 'incomplete';
	COMPLETED_PRODUCT = 'completed';
	productType = this.INCOMPLETE_PRODUCT;
  showTourDetailsModal: { [key: number]: boolean } = {};
  isProblemModalOpen = false;
  categories = Object.keys(Category)
    .filter(key => !isNaN(Number(Category[key as keyof typeof Category]))).map(key => ({
    value: Category[key as keyof typeof Category],
    label: key
  }));

  priorities = Object.keys(Priority)
    .filter(key => !isNaN(Number(Priority[key as keyof typeof Priority]))).map(key => ({
    value: Priority[key as keyof typeof Priority],
    label: key
  }));
  problemDetails: Details = {
    category: Category.Accommodation,
    priority: Priority.Medium,
    description: '',
  };
  currentTourId: number | null = null;

  constructor(private tourExecutionService: TourExecutionService , private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.authService.user$.subscribe(user =>{
      this.user = user;
    }) 
    if(this.user){
      this.getCompletedTourIds();
      this.checkActiveSession();
    }
  }
  
  getPurchasedByUser() : void{
    if(this.user?.id){
      this.tourExecutionService.getPurchased(this.user.id).subscribe({
        next: (result: any) => {
          if (result.message) {
            this.message = result.message;
            this.purchasedTours = [];
          } else{
            this.purchasedTours = result;
            this.completedTours = result.filter((tour:any) => this.completedTourIds.includes(tour.id));
          this.incompleteTours = result.filter((tour:any)=> !this.completedTourIds.includes(tour.id));
            this.message = this.purchasedTours.length === 0 ? "There is no purchased tours yet :(" : '';
          }
        },
        error: (err: any) => {
          if (err.status === 404) {
            // Postavljanje poruke za 404 grešku
            this.message = "No purchased tours found for this user.";
            this.purchasedTours = [];
            this.message = "There is no purchased tours yet :(";
          } else {
            // Za ostale greške
            console.log("Error fetching purchased tours: ", err);
            this.message = "An unexpected error occurred. Please try again later.";
          }
        }
      });
    }
  }
  getCompletedTourIds() :void {
    if(this.user?.id){
      this.tourExecutionService.getCompletedToursByTourist(this.user.id).subscribe({
        next: (result) => {
          this.completedTourIds = result
          this.getPurchasedByUser();
          this.completedTourIds.forEach(tour => {
            this.showTourDetailsModal[tour] = false;
          });
        },
        error: (err) => {
          this.message = err;
        }
      })
    }
  }

  createSession(tourId: number): void{
    if(this.user){
      if(this.activeTourExecution && this.activeTourExecution.tourId == tourId && this.activeTourExecution.userId == this.user.id){
        this.router.navigate([`/tour-execution/${this.activeTourExecution.id}`])
        return;
      }

      const dto: CreateTourExecutionDto = {
        UserId: this.user.id,
        TourId: tourId
      };

      this.tourExecutionService.createSession(dto).subscribe({
        next: (result: TourExecution) => {
          console.log('Tour execution created:', result);
          this.tourExecution = result;
          this.router.navigate([`/tour-execution/${result.id}`]);
        },
        error: (err: any) => {
          if (err.status === 403) {
            alert("You cannot start a new session because you already have an active one. Finish or abandon your current tour to start a new one.");
          } else {
            console.log('Error creating tour execution:', err);
          }
        }
      });
    }
  }

  checkActiveSession(): void{
    if(this.user?.id){
      this.tourExecutionService.getActiveSessionByUser(this.user.id).subscribe({
        next: (result: TourExecution | null) => {
          this.activeTourExecution = result;
        },
        error: (err: any) => {
          console.log('Error checking active session: ', err);
        }
      })
    }
  }

  isActiveSession(tourId: number): boolean {
    return this.activeTourExecution?.tourId === tourId && this.activeTourExecution?.userId === this.user?.id;
  }

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  mapToWeatherIcon(icon: string){
    if(icon === '01d')
      return null
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
  }
  mapToRoundNumber(number: number){
    return Math.round(number)
  }
  mapToRecommend(recommend?: number) {
    let message = "Neutral: No specific recommendation.";
  
    switch (recommend) {
      case 0:
        message = "Perfect conditions! Starting the tour is highly recommended.";
        break;
      case 1:
        message = "Good conditions. Starting the tour is recommended.";
        break;
      case 2:
        message = "Conditions are acceptable but not ideal.";
        break;
      case 3:
        message = "Poor conditions. Consider postponing the tour.";
        break;
      default:
        message = "Severe weather conditions! Starting the tour is highly discouraged.";
    }
    console.log(message)
    return message;
  }
  getRecommendClass(recommend?: number): string {
    switch (recommend) {
      case 0:
        return 'highly-recommended';
      case 1:
        return 'recommended';
      case 2:
        return 'neutral';
      case 3:
        return 'not-recommended';
      default:
        return 'highly-not-recommended';
    }
  }

	LevelMap = {
		0: 'Easy',
		1: 'Advanced',
		2: 'Expert'
	};
  handleProductTypeChange() {
		this.productType = this.productType === this.INCOMPLETE_PRODUCT ? this.COMPLETED_PRODUCT : this.INCOMPLETE_PRODUCT;
	}
  handleTourOption(option: string, tourId: number): void {
    console.log(`Selected option ${option} for tour ${tourId}`);
    // Dodaj if za svoju opciju
    if(option === 'Report'){
      this.currentTourId = tourId;
      this.openProblemModal();
    }
    this.showTourDetailsModal[tourId] = false; // Zatvori modal nakon akcije
  }
  openProblemModal(): void {
    
    this.isProblemModalOpen = true;
  }

  closeProblemModal(): void {
    this.currentTourId = null;
    this.isProblemModalOpen = false;
    this.resetProblemDetails();
  }

  resetProblemDetails(): void {
    this.problemDetails = {
      category: Category.Accommodation,
      priority: Priority.Medium,
      description: '',
    };
  }

  submitProblem(): void {
    if (
      this.problemDetails.category === null ||
      this.problemDetails.priority === null ||
      this.problemDetails.description.trim() === ''
    ) {
      alert('All fields must be filled to submit the problem.');
      return;
    }

    if (!this.currentTourId) {
      console.error('No tour selected for reporting a problem.');
      return;
    }
    if(this.user !== undefined){
      const problem: CreateProblemInput = {
        userId: this.user.id,
        tourId: this.currentTourId, 
        category: +this.problemDetails.category as Category,
        priority: +this.problemDetails.priority as Priority,
        description: this.problemDetails.description || ''
      };
      this.tourExecutionService.createProblem(problem).subscribe({
        next: (createdProblem: Problem) => {
          console.log('Problem created:', createdProblem);
          this.closeProblemModal();
        },
        error: (err) => {
          console.error('Error creating problem:', err);
        }
      });
    }
    this.closeProblemModal();
  }
}
