import { Component, OnInit } from '@angular/core';
import { Execution } from '../model/execution.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  encounterExecution: Execution | null = null;

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
            if(this.tourist && this.encounterExecutionId){
              this.getExecutionByUser();
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }) 
  }

  public getExecutionByUser(): void {
    this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
      next: (result: Execution) => {
        this.encounterExecution = result;
      },
      error: (error) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
        console.error(error);
      }
    });
  }


}
