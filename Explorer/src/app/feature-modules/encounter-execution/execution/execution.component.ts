import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Execution } from '../model/execution.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Encounter, EncounterType } from '../model/encounter.model';
import { environment } from 'src/env/environment';
import { timer } from 'rxjs';

@Component({
  selector: 'xp-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit{
  errorMessage: string | null = null;
  encounterExecutionId: string | null = null;
  tourExecutionId: string | null = null;
  user: User | undefined;
  tourist: Tourist | undefined;
  encounterExecution: Execution | undefined;
  encounter: Encounter | undefined;
  userMarker: { latitude: number, longitude: number } | null = null;
  public EncounterType = EncounterType;
  private intervalId: any;

  encounterCoordinates: { latitude: number; longitude: number }[] = [];
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(
    private encounterExecutionService: EncounterExecutionService,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  
    this.encounterExecutionId = this.route.snapshot.paramMap.get('id');
    this.tourExecutionId = this.route.snapshot.paramMap.get('tourExecutionId');
  
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.tourService.getTouristById(user.id).subscribe({
        next: (result: Tourist) => {
          this.tourist = result;
          if (this.tourist) {
            this.getExecutionByUser(() => {
              this.userMarker = {
                latitude: result.location.latitude,
                longitude: result.location.longitude
              };
              console.log('10s:', this.encounterExecution);
              if(this.encounterExecution?.encounterType === EncounterType.Social && !this.encounterExecution?.isComplete){
                this.intervalId = setInterval(() => {
                  this.completeSocialExecution();
                }, 10000);
              }
              
            });
          
              if(!this.encounterExecution?.isComplete && this.encounterExecution?.encounterType === EncounterType.Location){
                console.log(this.encounterExecution?.isComplete);
                this.intervalId = setInterval(() => {
                  this.completeExecution();
                }, 30000);
              }
          }

          this.emitCoordinates();
          
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getExecutionByUser(callback: () => void): void {
    this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
      next: (result: Execution) => {
        this.encounterExecution = result;
        if (this.tourist) {
          this.encounterExecution.userLatitude = this.tourist.location.latitude;
          this.encounterExecution.userLongitude = this.tourist.location.longitude;
        }
        if  (this.encounterExecution.encounterId)  {
          this.getEncounter();
        }
        callback(); // Pozovi nakon završetka        callback(); // Pozovi nakon završetka
      },
      error: (error) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
        console.error(error);
      }
    });
  }
  

  getEncounter(): void {
    if(this.encounterExecution){
      this.encounterExecutionService.getEncounter(this.encounterExecution.encounterId).subscribe({
        next: (result: Encounter) => {
          this.encounter = result;
          this.encounterCoordinates = [result.encounterLocation]
          console.log(this.encounterCoordinates)
          this.encounterCoordinatesLoaded.emit(this.encounterCoordinates);
        },
        error: (error) => {
          this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
          console.error(error);
        }
      })
    }
  }

/*  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    if(this.tourist){
      this.tourist.location.latitude = coordinates.latitude;
      this.tourist.location.longitude = coordinates.longitude;
      this.tourService.updateTourist(this.tourist).subscribe(updatedTourist => {
        console.log('Updated User:', updatedTourist);
        this.tourist = updatedTourist;
      }, error => {
        console.error('Error updating user:', error);
      });
      console.log('Encounter Location updated:', this.tourist.location);
    }
  }*/

    completeSocialExecution(): void {
      if (this.encounterExecution && this.encounterExecution.encounterType === EncounterType.Social) {
        this.encounterExecutionService.completeSocialExecution(this.encounterExecution)
          .subscribe({
            next: (result) => {
              console.log('Zahtev uspešno poslat:', result);
              this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
                next: (ex: Execution) => {
                  this.encounterExecution = ex;
                },
                error: (error) => {
                  this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
                  console.error(error);
                }
              });
            },
            error: (err) => {
              console.error('Došlo je do greške:', err);
            }
          });
        console.log('izvrsavam komplete na 10 sec');
      }
    }
    
completeExecution(): void {
  if (this.encounterExecution) {
      this.encounterExecutionService.completeExecution(this.encounterExecution).subscribe({
        next: (updatedExecution: Execution) => {
          console.log('Execution successfully completed:', updatedExecution);
          this.encounterExecution = updatedExecution;
          alert("Encounter successfully completed");
          if(this.tourExecutionId){
            this.router.navigate(['tour-execution/',this.tourExecutionId]);
          }else{
            this.router.navigate(['encounters']);
          }
        },
        error: (error) => {
          if (error.status === 500) {
            console.log('Ne mozes jos zavrsiti.');
            alert("You can not complete encounter yet");

          } else {
            console.error('Došlo je do greške:', error);
          }
        }

      })
  } else {
    console.warn('EncounterExecution nije inicijalizovan.');
  }
}

// completeExecutionnn(): void {
//   if (this.encounterExecution) {
//       this.encounterExecutionService.completeExecution(this.encounterExecution).subscribe(
//       (updatedExecution: Execution) => {
//         console.log('Execution successfully completed:', updatedExecution);
//         this.encounterExecution = updatedExecution;
//         if(this.tourExecutionId){
//           this.router.navigate(['tour-execution/',this.tourExecutionId]);
//         }else{
//           this.router.navigate(['encounters']);
//         }
//       },
//       error => {
//         if (error.status === 500) {
//           console.log('Ne mozes jos zavrsiti.');
//         } else {
//           console.error('Došlo je do greške:', error);
//         }
//       }
//     );
//   } else {
//     console.warn('EncounterExecution nije inicijalizovan.');
//   }
// }

  
  getImagePath(imageUrl: string) {
    return environment.webRootHost +"/images/encounters/"+ imageUrl;
  }
  

  ConvertType(): number {
    if(this.encounter){
      switch (this.encounter.encounterType.toString()) {
        case  "Social" :
          return 0;
        case "Location":
          return 1;
        case "Misc":
          return 2;
        default:
          return 0; 
      }
    }
    return 0;
  }
  emitCoordinates(): void {
    const allCoordinates = [...this.encounterCoordinates];
    if (this.userMarker) {
      allCoordinates.push(this.userMarker);
    }
    this.encounterCoordinatesLoaded.emit(allCoordinates);
  }
  mapToType(type:number):string{
    switch(type){
      case 0:
        return "Social";
      case 1:
        return "Location";
      case 2: 
        return "Misc";
      default:
        return "Base";
    }
  }
  mapToStatus(status:number):string{
    switch(status){
      case 0:
        return "Active";
      case 1:
        return "Draft";
      case 2: 
        return "Archived";
      case 3:
        return "Pendig";
      case 4: 
        return "Canceled"
      default:
        return "Base";
    }
  }
  navigateToPositionSimulator(){
    if(this.tourExecutionId){
      this.router.navigate(['/position-sim',this.encounterExecutionId,this.tourExecutionId])
    }else{
      this.router.navigate(['/position-sim',0,this.encounterExecutionId])
    }
  }
  navigateToTourExecution(){
    this.router.navigate(['tour-execution/',this.tourExecutionId])
  }
}