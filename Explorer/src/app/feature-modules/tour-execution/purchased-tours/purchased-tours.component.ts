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
import { Observable } from 'rxjs';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit{
  searchMode: string = 'all';
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
  minDate: string = '';
  maxDate: string = '';
  selectedDate: string;

  constructor(private tourExecutionService: TourExecutionService , private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.authService.user$.subscribe(user =>{
      this.user = user;
    }) 
    if(this.user){
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 5);
      this.minDate = today.toISOString().split('T')[0];
      this.maxDate = maxDate.toISOString().split('T')[0];
      this.selectedDate = this.minDate;
      this.getCompletedTourIds();
      this.checkActiveSession();
    }
  }
  
  getPurchasedTours(apiMethod: string, date?: string): void {
    if (this.user?.id) {
      const finalDate = date ?? this.minDate;
      const methodMap: { [key: string]: Observable<any> } = {
        'getPurchased': this.tourExecutionService.getPurchased(this.user.id),
        'getPurchasedForDate': this.tourExecutionService.getPurchasedForDate(finalDate),
        'getBestPurchasedForDate': this.tourExecutionService.getBestPurchasedForDate(finalDate)
      };
  
      methodMap[apiMethod]?.subscribe({
        next: (result: any) => {
          if (result.message) {
            this.message = result.message;
            this.purchasedTours = [];
          } else {
            this.purchasedTours = result;
            this.completedTours = result.filter((tour: any) => this.completedTourIds.includes(tour.id));
            this.incompleteTours = result.filter((tour: any) => !this.completedTourIds.includes(tour.id));
            this.message = this.purchasedTours.length === 0 ? "There is no purchased tours yet :(" : '';
          }
        },
        error: (err: any) => {
          if (err.status === 404) {
            this.message = "No purchased tours found for this user.";
            this.purchasedTours = [];
            this.message = "There is no purchased tours yet :(";
          } else {
            console.log("Error fetching purchased tours: ", err);
            this.message = "An unexpected error occurred. Please try again later.";
          }
        }
      });
    }
  }

  getPurchased() {
    this.getPurchasedTours('getPurchased');
  }

  getPurchasedForDate() {
    this.getPurchasedTours('getPurchasedForDate', this.selectedDate);
  }

  getBestPurchasedForDate() {
    this.getPurchasedTours('getBestPurchasedForDate', this.selectedDate);
  }

  getCompletedTourIds() :void {
    if(this.user?.id){
      this.tourExecutionService.getCompletedToursByTourist(this.user.id).subscribe({
        next: (result) => {
          this.completedTourIds = result
          this.getPurchased();
        },
        error: (err) => {
          this.message = err;
        }
      })
    }
  }

  onSearchModeChange(mode: string): void {
    this.searchMode = mode;
    if (mode === 'all') {
      this.selectedDate = this.minDate;
      this.getPurchased();
    }else{
      if(this.selectedDate === this.minDate){
        this.getPurchased();
      }
      if(this.selectedDate !== this.minDate){
        this.getBestPurchasedForDate();
      }
    }
  }

  onDateChange(): void {
    if (this.selectedDate) {
      if(this.selectedDate === this.minDate){
        this.getPurchased();
        return;
      } 
      if (this.searchMode === 'all') {
          this.getPurchasedForDate();
      } else {
          this.getBestPurchasedForDate();
      }
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
    if (this.productType === this.INCOMPLETE_PRODUCT) {
      this.productType = this.COMPLETED_PRODUCT;
    } else {
      this.productType = this.INCOMPLETE_PRODUCT;
    }
  }

}
