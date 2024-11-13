import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecution } from '../model/tour-execution.model';
import { environment } from 'src/env/environment';
import { UpdateTourExecutionDto } from '../model/update-tour-execution.dto';
import { TourService } from '../../tour-authoring/tour.service';
import { Tourist } from '../../tour-authoring/model/tourist';
import { DatePipe } from '@angular/common';
import { CheckpointStatus } from '../model/checkpoint-status.model';

@Component({
  selector: 'xp-tour-execution-details',
  templateUrl: './tour-execution-details.component.html',
  styleUrls: ['./tour-execution-details.component.css']
})
export class TourExecutionDetailsComponent implements OnInit{
  tourExecutionId : string | null=null;
  user : User | undefined;
  tourist : Tourist | undefined;
  tourExecution : TourExecution | null=null;
  executionStatus : string | null = null;
  currentCheckpoint : CheckpointStatus;
  currentIndex : number =0;
  dto: UpdateTourExecutionDto = {
    TourExecutionId: 0,
    Longitude: 0,
    Latitude: 0
  };
  private intervalId : any;

  constructor(private tourExecutionService: TourExecutionService,private datePipe : DatePipe , private authService: AuthService,private tourService : TourService , private route : ActivatedRoute){}

  ngOnInit(): void {
      this.tourExecutionId = this.route.snapshot.paramMap.get('id');
      this.authService.user$.subscribe(user =>{
        this.user = user;
        this.tourService.getTouristById(user.id).subscribe({
          next: (result: Tourist) => {
            this.tourist = result;
            if(this.tourist && this.tourExecutionId){
              this.fetchTourExecution();
      
              this.intervalId = setInterval( ()=> {
                this.updateTourExecution();
              },10000)
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }) 
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
        this.currentCheckpoint = result.checkpointsStatus[this.currentIndex];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  updateTourExecution(){
    this.dto.TourExecutionId= Number(this.tourExecutionId)
    this.dto.Latitude = this.tourist?.location.latitude ?? 0;
    this.dto.Longitude = this.tourist?.location.longitude ?? 0;
    this.tourExecutionService.updateTourExecution(this.dto).subscribe({
      next: (result : TourExecution) => {
        this.tourExecution = result;
      },
      error: (err : any) => {
        console.log(err);
      }
    });
  }
  mapToTourExecutionStatus(status : number) {
    if(status===0){
      return "Active"
    }else if(status===1){
      return "Completed"
    }else{
      return "Abandoned"
    }
  }
 mapToCompletionTime(date: any) {
  // Ensure date is a valid Date object
  const validDate = new Date(date);
  const minDate = new Date("0001-01-01T00:00:00Z"); // Najmanji mogući datum (1970-01-01T00:00:00Z)
  
  // Check if the provided date is valid
  if (isNaN(validDate.getTime())) {
    console.error("Invalid date:", date);
    return "Invalid date"; // Or handle the invalid date case as needed
  }
  
  if (validDate.getUTCFullYear() < minDate.getUTCFullYear()) {
    return 'Niste stigli do ovog checkpointa';
  }

  const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy, HH:mm a');
  return formattedDate || date;
 }
 getCurrentCheckpointIndex(): number {
  // Proverite da li postoji 'tourExecution' i 'checkpointsStatus', a zatim pronađite indeks trenutnog checkpointa
  if (this.tourExecution && this.tourExecution.checkpointsStatus) {
    return this.currentIndex
  }
  return -1; // Ako nije pronađen trenutni checkpoint, vraćamo -1
}
setCurrentCheckpoint(index: number): void {
  this.currentIndex = index;
  console.log(this.currentIndex)
  this.currentCheckpoint = this.tourExecution?.checkpointsStatus[this.currentIndex] ?? this.currentCheckpoint
} 
}
