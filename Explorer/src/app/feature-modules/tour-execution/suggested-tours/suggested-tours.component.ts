import { Component, Inject, Input, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-suggested-tours',
  templateUrl: './suggested-tours.component.html',
  styleUrls: ['./suggested-tours.component.css']
})
export class SuggestedToursComponent implements OnInit {
  tours: Tour[] = [];
  user: User | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {longitude: number, latitude: number},
    private tourExecutionService: TourExecutionService, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void{
    this.authService.user$.subscribe(user =>{
      this.user = user;
    })
    //this.longitude = Number(this.route.snapshot.paramMap.get('longitude'));
    //this.latitude = Number(this.route.snapshot.paramMap.get('latitude'));
    this.getSuggestedTours();
  }

  getSuggestedTours(){
    this.tourExecutionService.getSuggestedTours(this.data.longitude, this.data.latitude).subscribe({
      next: (result: any) => {
        if(result.message){
          this.tours = [];
        }
        else{
          this.tours = result;
        }
      },
      error: (err: any) => {
        console.log("Error fetching suggested tours: ", err);
      }
    })
  }
  
  getImagePath(imageUrl: string | undefined) : string{
    return environment.webRootHost + imageUrl;
  }

  goToTour(tourId : number) : void{
    this.router.navigate(['tourDetails/', tourId]);
  }
}

