import { Component, OnInit } from '@angular/core';
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

  constructor(
    private encounterExecutionService: EncounterExecutionService,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.encounterExecutionId = this.route.snapshot.paramMap.get('id');
      this.authService.user$.subscribe(user =>{
        this.user = user;
        this.tourService.getTouristById(user.id).subscribe({
          next: (result: Tourist) => {
            this.tourist = result;
            if(this.tourist){
              this.getExecutionByUser();
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      })
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
