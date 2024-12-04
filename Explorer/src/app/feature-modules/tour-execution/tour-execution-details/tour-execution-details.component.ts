import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecution } from '../model/tour-execution.model';
import { environment } from 'src/env/environment';
import { UpdateTourExecutionDto } from '../model/update-tour-execution.dto';
import { BehaviorSubject } from 'rxjs';

import { TourService } from '../../tour-authoring/tour.service';
import { Tourist } from '../../tour-authoring/model/tourist';
import { DatePipe } from '@angular/common';
import { CheckpointStatus } from '../model/checkpoint-status.model';
import { Checkpoint } from '../../tour-authoring/model/tourCheckpoint.model';
import { EncounterExecutionService } from '../../encounter-execution/encounter-execution.service';
import { Execution } from '../../encounter-execution/model/execution.model';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-tour-execution-details',
  templateUrl: './tour-execution-details.component.html',
  styleUrls: ['./tour-execution-details.component.css']
})
export class TourExecutionDetailsComponent implements OnInit{
  tourExecutionId : string | null=null;
  user : User;
  tourist : Tourist;
  tourExecution : TourExecution | null=null;
  executionStatus : string | null = null;
  currentCheckpoint : CheckpointStatus;
  currentIndex : number =0;
  dto: UpdateTourExecutionDto = {
    TourExecutionId: 0,
    Longitude: 0,
    Latitude: 0
  };
  private intervalId: any;
  isReviewFormOpen = false;
  isBelowThirtyFivePercent = false;
  userMarker: { latitude: number, longitude: number } | null = null;
  tourName = "";
  tourDescription = "";

  checkpoints: Checkpoint[] = [];
  encounterIds: number[] = [];
  checkpointCoordinates: { latitude: number, longitude: number }[] = [];
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  isViewMode:boolean = false;

  constructor(
    private encounterService: EncounterExecutionService,
    private tourService: TourService,
    private datePipe: DatePipe,
    private tourExecutionService: TourExecutionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private percentageSubject = new BehaviorSubject<number | null>(null);
  percentageCompleted = 0;

  ngOnInit(): void {
      this.tourExecutionId = this.route.snapshot.paramMap.get('id');
      this.authService.user$.subscribe(user =>{
        this.user = user;
        this.tourService.getTouristById(user.id).subscribe({
          next: (result: Tourist) => {
            this.tourist = result;
            this.userMarker = {
              latitude: this.tourist.location.latitude,
              longitude: this.tourist.location.longitude
            };
            if(this.tourist && this.tourExecutionId){
              this.fetchTourExecution();
              this.updateTourExecution()
              this.intervalId = setInterval( ()=> {
                this.updateTourExecution();
              },10000)
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        })
        this.encounterService.getAllEncounterIdsByUserId(user.id).subscribe({
          next: (ids)=>{
            this.encounterIds = ids;
          },
          error:(err:any) => {
            console.log(err);
          }
        }) 
      })
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getImagePath(imageUrl: string) {
    return environment.webRootHost + imageUrl;
  }
  
  getExecutionStatusText(): string {
    switch (this.tourExecution?.executionStatus) {
      case 0:
        return 'Active';
      case 1:
        return 'Completed';
      case 2:
        return 'Abandoned';
      default:
        return 'Unknown';
    }
  }

  isSecretUnlocked(completionTime: any): boolean {
    console.log("USLO!: ", completionTime);
    const fortyYearsInMilliseconds = 40 * 365.25 * 24 * 60 * 60 * 1000; 
    const now = Date.now(); 
  
    let completionTimestamp: number;
  
    // Proveravamo i konvertujemo u Date ako nije već Date objekat
    if (completionTime instanceof Date) {
      completionTimestamp = completionTime.getTime();
    } else {
      completionTimestamp = new Date(completionTime).getTime();
    }
  
    console.log("PROSLO1:", completionTimestamp);
    const isUnlocked = (now - completionTimestamp) < fortyYearsInMilliseconds;
    console.log("I:", isUnlocked);
  
    return isUnlocked;
  }
  

  fetchTourExecution(): void {
    this.tourExecutionService.getTourExecution(this.tourExecutionId!).subscribe({
      next: (result: TourExecution) => {
        this.tourExecution = result;
        this.currentCheckpoint = result.checkpointsStatus[this.currentIndex];
        this.loadCheckpoints();
        this.tourService.getTourById(this.tourExecution?.tourId || 1).subscribe({
        next: (result: Tour) => {
          this.tourName = result.name;
          this.tourDescription = result.description;
        }
      }) 
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
      next: (result: TourExecution) => {
        this.tourExecution = result;
        this.currentCheckpoint = result.checkpointsStatus[this.currentIndex];
        this.tourExecutionService.getPercentage(this.tourExecution?.id || 0).subscribe({
          next: (percent: number) => {
            console.log(`Pređeni procenat: ${percent}`);
            this.percentageSubject.next(percent);
            this.percentageCompleted = percent;
      
            const isDisabled = percent <= 35;
            console.log(`Disabled dugme? ${isDisabled}`);
            this.isLessThanThirtyFivePercent();
          },
          error: (err: any) => {
            console.error('Greška prilikom dobijanja procenta:', err);
            this.percentageSubject.next(0); 
          }
        });
      },
      error: (err: any) => {
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

  openReviewForm(): void {
      this.isReviewFormOpen = true;
  }

  closeReviewForm(): void {
    this.isReviewFormOpen = false;
  }

  isFirstCheckpoint(): boolean {
    return this.getCurrentCheckpointIndex() === 0;
  }

  isLastCheckpoint(): boolean {
    return this.getCurrentCheckpointIndex() === (this.tourExecution?.checkpointsStatus?.length ?? 1) - 1;
  }

  goToPreviousCheckpoint(): void {
    const currentIndex = this.getCurrentCheckpointIndex();
    if (currentIndex > 0) {
      this.setCurrentCheckpoint(currentIndex - 1);
    }
  }

  goToNextCheckpoint(): void {
    const currentIndex = this.getCurrentCheckpointIndex();
    if (currentIndex < (this.tourExecution?.checkpointsStatus?.length ?? 1) - 1) {
      this.setCurrentCheckpoint(currentIndex + 1);
    }
  }

isMoreThanSevenDaysAgo(): boolean {
  if (!this.tourExecution?.lastActivity) {
    return true; 
  }
  const lastActivityDate = new Date(this.tourExecution.lastActivity);
  const currentDate = new Date();
  const diffInDays = (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
}

isLessThanThirtyFivePercent(): void {
  if (this.percentageSubject.value !== null) {
    this.isBelowThirtyFivePercent = this.percentageSubject.value <= 35;
    this.percentageCompleted = this.percentageSubject.value;
    return; 
  }

  this.tourExecutionService.getPercentage(this.tourExecution?.id || 0).subscribe({
    next: (percent: number) => {
      this.percentageSubject.next(percent);
      this.percentageCompleted = percent;

      const isDisabled = percent <= 35;
    },
    error: (err: any) => {
      this.percentageSubject.next(0); 
    }
  });
}

isDisabled(): boolean {
  
  if(this.isBelowThirtyFivePercent) {
    return true;
  } else if(!this.isMoreThanSevenDaysAgo()) {
    return true;
  }
  //console.log("IsDisabled3: falsee")
  return false;
}

getReviewMessage(): string {
  const isPastSevenDays = !this.isMoreThanSevenDaysAgo();
  //console.log("Manje od 7 dana:", isPastSevenDays)
  //console.log("Manje od 35:", this.isBelowThirtyFivePercent)
  if (isPastSevenDays && this.isBelowThirtyFivePercent) {
    return "Review cannot be submitted because more than 7 days have passed since the last activity and less than 35% of the tour has been completed.";
  } else if (isPastSevenDays) {
    return "Review cannot be submitted because more than 7 days have passed since the last activity.";
  } else if (this.isBelowThirtyFivePercent) {
    return "Review cannot be submitted because less than 35% of the tour has been completed.";
  } else {
    return ""; 
  }
  }

  completeSession(): void{
    if (this.tourExecutionId && this.user) {
      this.tourExecutionService.completeSession(this.user.id).subscribe({
        next: (result) => {
          console.log('Session completed successfully', result);
          this.tourExecution = result;
          this.router.navigate([`/purchased`]);
          alert('Session completed successfully');
        },
        error: (err) => {
          if (err.status === 500) {
            console.error('Error completing session', err);
            alert('You can not complete this session yet');
          } else {
            console.error('Other error', err);
          }
        }
      });
    }
  }

  abandonSession(): void{
    if (this.tourExecutionId && this.user) {
      this.tourExecutionService.abandonSession(this.user.id).subscribe({
        next: (result) => {
          console.log('Session abandoned successfully', result);
          this.tourExecution = result;
          this.router.navigate([`/purchased`]);
          alert('Session abandoned successfully');
        },
        error: (err) => {
          if (err.status === 500) {
            console.error('Error abandoning session', err);
            alert('You can not abadnon this session yet');
          } else {
            console.error('Other error', err);
          }
        }
      });
    }
  }

  loadCheckpoints(): void {
    if(this.tourExecution){
      this.tourService.getTourById(this.tourExecution.tourId).subscribe({
        next: (data) => {
          this.checkpoints = data.checkpoints; 
          this.checkpointCoordinates = this.checkpoints.map(cp => ({ latitude: cp.latitude, longitude: cp.longitude }));
          this.checkpointsLoaded.emit(this.checkpointCoordinates);
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
      });
    }
  }
  isTouristNear(latitude:number,longitude: number,encounterId:number){
    var tolerance : number = 0.0018;
    if(!this.tourist)
      return false
    
    var isNearLatitude : boolean = Math.abs(latitude-this.tourist?.location.latitude) <= tolerance;
    var isNearLongitude : boolean = Math.abs(longitude-this.tourist?.location.longitude) <= tolerance;
    console.log(latitude)
    if(!encounterId)
      return false;
    const isStarted: boolean = this.encounterIds.includes(encounterId);
    return isNearLatitude && isNearLongitude && !isStarted;
  }
  isFinished(encouterId:number){
    return this.encounterIds.includes(encouterId)
  }
  Execute(encounterId:number){
    this.encounterService.findExecution(this.user.id,encounterId).subscribe(
      (ex: Execution | null) => {
        if (ex) {
          console.log('Execution found:', ex);
          this.router.navigate(['/encounter-execution', ex.id,this.tourExecutionId]);
        } else {
          console.log('Execution not found.');
          this.CreateExecution(encounterId);
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }
  CreateExecution(encounterId:number) {
      this.encounterService.getEncounter(encounterId).subscribe({
        next: (encounter) => {
          const execution: Execution = {
            userId: this.user.id, 
            encounterId: encounter.id || 0,
            isComplete: false,
            encounterType: encounter.encounterType, 
            userLongitude: this.tourist.location.longitude, 
            userLatitude: this.tourist.location.latitude, 
            participants: 0 
          };
          this.encounterService.addEncounterExecution(execution).subscribe({
            next: (response) => {
              const encounterExecutionId = response.id;
        
              if (encounterExecutionId) {
                this.router.navigate(['/encounter-execution',encounterExecutionId,this.tourExecutionId]);
              } else {
                console.error('EncounterExecution ID not found in response.');
              }
            },
            error: (err) => {
              console.error('Failed to create EncounterExecution:', err);
            }
          });
        }
      });
  }
}
