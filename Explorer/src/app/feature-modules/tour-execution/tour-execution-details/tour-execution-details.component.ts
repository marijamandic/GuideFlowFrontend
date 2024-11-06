import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecution } from '../model/tour-execution.model';
import { environment } from 'src/env/environment';
import { UpdateTourExecutionDto } from '../model/update-tour-execution.dto';

@Component({
  selector: 'xp-tour-execution-details',
  templateUrl: './tour-execution-details.component.html',
  styleUrls: ['./tour-execution-details.component.css']
})
export class TourExecutionDetailsComponent implements OnInit{
  tourExecutionId : string | null=null;
  user : User | undefined;
  tourExecution : TourExecution | null=null;
  dto: UpdateTourExecutionDto = {
    TourExecutionId: 0,
    Longitude: 0,
    Latitude: 0
  };
  private intervalId : any;

  constructor(private tourExecutionService: TourExecutionService , private authService: AuthService, private router: Router , private route : ActivatedRoute){}

  ngOnInit(): void {
      this.tourExecutionId = this.route.snapshot.paramMap.get('id');
      this.authService.user$.subscribe(user =>{
        this.user = user;
      }) 
      if(this.user && this.tourExecutionId){
        this.fetchTourExecution();

        this.intervalId = setInterval( ()=> {
          this.updateTourExecution();
        },10000)
      }
  }
  ngOnDestroy() : void {
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
  }
  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  fetchTourExecution(): void {
    this.tourExecutionService.getTourExecution(this.tourExecutionId!).subscribe({
      next: (result: TourExecution) => {
        this.tourExecution = result;
        console.log(result);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  updateTourExecution(){

    this.dto.TourExecutionId= Number(this.tourExecutionId)
    this.dto.Latitude = 46.2075;
    this.dto.Longitude = 6.1502;
    this.tourExecutionService.updateTourExecution(this.dto).subscribe({
      next: (result : TourExecution) => {
        this.tourExecution = result;
      },
      error: (err : any) => {
        console.log(err);
      }
    });
  }
}
