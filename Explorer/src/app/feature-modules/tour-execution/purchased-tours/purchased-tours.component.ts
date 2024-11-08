import { Component, OnInit } from '@angular/core';
import { PurchasedTours } from '../model/purchased-tours.model';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { CreateTourExecutionDto } from '../model/create-tour-execution.dto';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit{
  purchasedTours: PurchasedTours[] = [];
  message: string = '';
  selectedPurchasedTour: PurchasedTours;
  tourExecutionId : string | null=null;
  user: User | undefined;
  tourExecution: TourExecution | null=null;
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
    }
  }

  getPurchasedByUser() : void{
    if(this.user?.id){
      this.tourExecutionService.getPurchased(this.user.id).subscribe({
        next: (result: any) => {
          if (result.message) {
            this.message = result.message;
            this.purchasedTours = [];
          } else {
            this.purchasedTours = result;
            this.message = this.purchasedTours.length === 0 ? "There is no purchased tours yet :(" : '';
          }
        },
        error: (err: any) => {
          console.log("Error fetching purchased tours: ", err);
        }
      });
    }
  }

  createSession(tourId: number): void{
    if(this.user){
      const dto: CreateTourExecutionDto = {
        UserId: this.user.id,
        TourId: tourId
      };

      this.tourExecutionService.createSession(dto).subscribe({
        next: (result: TourExecution) => {
          console.log('Tour execution created:', result);
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

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
}
