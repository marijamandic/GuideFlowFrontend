import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { AlertService } from '../../layout/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { SuggestedToursComponent } from '../../tour-execution/suggested-tours/suggested-tours.component';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

@Component({
  selector: 'xp-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit{
  errorMessage: string | null = null;
  //encounterExecutionId: string | null = null;
 
  user: User | undefined;
  tourist: Tourist | undefined;
  encounterExecution: Execution;
  encounter: Encounter;
  userMarker: { latitude: number, longitude: number } | null = null;
  public EncounterType = EncounterType;
  private intervalId: any;
  flag:boolean = false;
  encounterCoordinates: { latitude: number; longitude: number }[] = [];
  @Input() encounterExecutionId: number;
  @Input()  tourExecutionId?: number| null = null;
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  

  constructor(
    private encounterExecutionService: EncounterExecutionService,
    private tourService: TourService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    public dialog: MatDialog,
    private tourExecutionService: TourExecutionService
  ) {}

  ngOnInit(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  
    //this.encounterExecutionId = this.route.snapshot.paramMap.get('id');
    //this.encounterExecutionId = this.executionId;
    //this.tourExecutionId = this.route.snapshot.paramMap.get('tourExecutionId');
  
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
             
            });
            
              
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
        console.log("encounterExecution:", this.encounterExecution);
        if (this.tourist) {
          this.encounterExecution.userLatitude = this.tourist.location.latitude;
          this.encounterExecution.userLongitude = this.tourist.location.longitude;
        }
        if  (this.encounterExecution.encounterId)  {
          this.getEncounter();
        }
        callback(); // Pozovi nakon završetka
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
          this.encounterExecution.encounterType = result.encounterType;
          console.log("encounter:", this.encounter);
          console.log("execution:", this.encounterExecution);

          this.setUpIntervalLogic();

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

  setUpIntervalLogic(): void {
    if (this.encounterExecution?.encounterType === EncounterType.Social && !this.encounterExecution?.isComplete) {
      console.log("Pokreće interval za Social encounter");

      this.intervalId = setInterval(() => {
        if(!this.flag){
          this.updateUser();
          this.flag = true;
        }
      }, 10000);
    }
  
    if (!this.encounterExecution?.isComplete && this.encounterExecution?.encounterType === EncounterType.Location) {
      console.log("Pokreće interval za Location encounter");
      this.intervalId = setInterval(() => {
        this.updateUser();
      }, 10000);
    }
  }
  async updateUser(){
    await this.getUserWithTourist();  
    this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
      next: (ex: Execution) => {
        this.encounterExecution = ex;
      },
      error: (error) => {
        this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
        console.error(error);
      }
    });  
  }



    completeSocialExecution(): void {
      console.log(this.encounterExecution);
      if (this.encounterExecution && this.encounterExecution.encounterType === EncounterType.Social) {
        this.encounterExecutionService.completeSocialExecution(this.encounterExecution)
          .subscribe({
            next: (result) => {
              console.log('Zahtev uspešno poslat:', result);
              this.encounterExecutionService.getExecution(this.encounterExecutionId!).subscribe({
                next: (ex: Execution) => {
                  this.encounterExecution = ex;
                  this.alertService.showAlert("You joined encounter successfully", "success", 5);
                  if(ex.isComplete){
                    this.alertService.showAlert("Encounter successfully completed", "success", 5);
                    if(this.tourExecutionId){
                      // setTimeout(() => {
                      // this.router.navigate(['tour-execution/',this.tourExecutionId]);
                      //   }, 3000);
                      this.openSuggestedToursModal();

                    }else{
                     // this.router.navigate(['encounters']);
                     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['encounters']); // Navigacija na trenutnu rutu
                      this.openSuggestedToursModal();
                    });
                    }
                  }
                },
                error: (error) => {
                  this.errorMessage = 'Došlo je do greške prilikom učitavanja podataka.';
                  console.error(error);
                }
              });
            },
            error: (err) => {
              console.error('Došlo je do greške:', err);
              this.alertService.showAlert("You can not complete encounter yet", "warning", 5)
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
          //alert("Encounter successfully completed");
          this.alertService.showAlert("Encounter successfully completed", "success", 5);
          if(this.tourExecutionId){
            // setTimeout(() => {
            // this.router.navigate(['tour-execution/',this.tourExecutionId]);
            //   }, 3000);
            this.openSuggestedToursModal();
          }else{
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['encounters']); // Navigacija na trenutnu rutu
              this.openSuggestedToursModal();
            });
           // this.router.navigate(['encounters']);
           //setTimeout(() => {
            //window.location.reload();
           // }, 3000);
            //this.router.navigate(['suggested-tours/' + this.encounter.encounterLocation.longitude + '/' + this.encounter.encounterLocation.latitude]);
           // this.openSuggestedToursModal();
          }
        },
        error: (error) => {
          if (error.status === 500) {
            console.log('Ne mozes jos zavrsiti.');
            //alert("You can not complete encounter yet");
            this.alertService.showAlert("You can not complete encounter yet", "warning", 5);

          } else {
            console.error('Došlo je do greške:', error);
          }
        }

      })
  } else {
    console.warn('EncounterExecution nije inicijalizovan.');
  }
}
  
  getImagePath(imageUrl: string) {
    return environment.webRootHost +"images/encounters/"+ imageUrl;
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

  getUserWithTourist(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authService.user$.subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
  
            this.tourService.getTouristById(user.id).subscribe({
              next: (result: Tourist) => {
                this.tourist = result;
                if(this.tourist){
                  this.encounterExecution.userLatitude = this.tourist.location.latitude;
                  this.encounterExecution.userLongitude = this.tourist.location.longitude;
                }
                if(this.encounterExecution.encounterType == EncounterType.Social){
                  this.encounterExecutionService.completeExecution(this.encounterExecution).subscribe({
                    next: result => {
                      this.encounterExecution = result
                        this.completeSocialExecution();
                    }
                  });
                }else{
                  this.completeExecution();
                }
                resolve(); // Signaliziramo da je operacija završena
              },
              error: (err) => {
                console.error('Greška prilikom dobijanja turiste:', err);
                reject(err); // Signaliziramo grešku
              }
            });
          } else {
            resolve(); // Ako nema korisnika, završavamo bez greške
          }
        },
        error: (err) => {
          console.error('Greška prilikom preuzimanja korisnika:', err);
          reject(err);
        }
      });
    });
  }

  openSuggestedToursModal(): void {
    console.log('Proveravam da li ima predloženih tura');
    this.tourExecutionService.getSuggestedTours(this.encounter.encounterLocation.longitude, this.encounter.encounterLocation.latitude).subscribe({
      next: (result: any) => {
        if (result && result.length > 0) {
          console.log('Otvaram modal sa predloženim turama');
          const dialogRef = this.dialog.open(SuggestedToursComponent, {
            data: {
              longitude: this.encounter.encounterLocation.longitude,
              latitude: this.encounter.encounterLocation.latitude
            }
          });
          dialogRef.componentInstance.closeDialog = () => {
            dialogRef.close(); // Close the dialog when called from the modal
          };
          dialogRef.afterClosed().subscribe(result => {
            console.log('Modal zatvoren', result);
          });
        } else {
          console.log('Nema predloženih tura, modal se neće otvoriti');
        }
      },
      error: (error) => {
        console.error('Greška prilikom dobijanja predloženih tura:', error);
      }
    });
  }
  
}