import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Execution } from '../model/execution.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Encounter, EncounterType } from '../model/encounter.model';

@Component({
  selector: 'xp-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit{
  errorMessage: string | null = null;
  encounterExecutionId: string | null = null;
  user: User | undefined;
  tourist: Tourist | undefined;
  encounterExecution: Execution | undefined;
  encounter: Encounter | undefined;
  public EncounterType = EncounterType;

  touristCoordinates: { latitude: number; longitude: number }[] = [];
  @Output() touristCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(
    private encounterExecutionService: EncounterExecutionService,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.encounterExecutionId = this.route.snapshot.paramMap.get('id');
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.tourService.getTouristById(user.id).subscribe({
        next: (result: Tourist) => {
          this.tourist = result;
          if (this.tourist) {
            this.getExecutionByUser();
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    });
  
  }

  getExecutionByUser(): void {
    this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
      next: (result: Execution) => {
        this.encounterExecution = result;
        if(this.tourist){
          this.encounterExecution.userLatitude = this.tourist.location.latitude;
          this.encounterExecution.userLongitude = this.tourist.location.longitude;
        }
        if(this.encounterExecution.encounterId){
          this.getEncounter();
        }

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
        },
        error: (error) => {
          this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
          console.error(error);
        }
      })
    }
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    if(this.tourist){
      this.tourist.location.latitude = coordinates.latitude;
      this.tourist.location.longitude = coordinates.longitude;
      this.tourService.updateTourist(this.tourist).subscribe(updatedTourist => {
        console.log('Updated User:', updatedTourist);
        this.ngOnInit();
      }, error => {
        console.error('Error updating user:', error);
      });
      console.log('Encounter Location updated:', this.tourist.location);
    }
  }

  completeExecution(): void {
    if (this.encounterExecution) {
      this.encounterExecutionService.completeExecution(this.encounterExecution).subscribe(
        (updatedExecution: Execution) => {
          console.log('Execution successfully completed:', updatedExecution);
          this.ngOnInit();
        },
        error => {
          if (error.status === 500) {
            console.log('Ne mozes jos zavrsiti.');
          } else {
            console.error('Došlo je do greške:', error);
          }
        }
      );
    } else {
      console.warn('EncounterExecution nije inicijalizovan.');
    }
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
}