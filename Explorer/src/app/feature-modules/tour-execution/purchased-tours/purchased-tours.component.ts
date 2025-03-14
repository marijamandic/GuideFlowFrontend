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

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit{
  purchasedTours: Tour[] = [];
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

  constructor(private tourExecutionService: TourExecutionService , private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.authService.user$.subscribe(user =>{
      this.user = user;
    }) 
    if(this.user){
      this.getPurchasedByUser();
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

	LevelMap = {
		0: 'Easy',
		1: 'Advanced',
		2: 'Expert'
	};

}
