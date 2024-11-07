import { Component, OnInit } from '@angular/core';
import { PurchasedTours } from '../model/purchased-tours.model';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../model/tour-execution.model';
import { CreateTourExecutionDto } from '../model/create-tour-execution.dto';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent implements OnInit{
  purchasedTours: PurchasedTours[] = [];
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
        next: (result: PurchasedTours[]) => {
          this.purchasedTours = result;
          console.log(result);
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
          console.log('Error creating tour execution:', err);
        }
      });
    }
  }
}
