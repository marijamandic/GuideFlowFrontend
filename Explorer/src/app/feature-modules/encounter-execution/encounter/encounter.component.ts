import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EncounterExecutionService } from '../encounter-execution.service';
import { Encounter } from '../model/encounter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { Execution } from '../model/execution.model';
import { EncounterTourist } from '../model/encounter-tourist.model';
import { EncounterError } from '../model/encounter-error';
import { MatDialog } from '@angular/material/dialog';
import { EncounterFormComponent } from '../encounter-form/encounter-form.component';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  encounters: Encounter[] = [];
  filteredEncounters: Encounter[] = [];
  encounterTourist: EncounterTourist;
  activeExecutionId:number=-1;
  tourExecutionId:number = -1;
  encounterCoordinates: { latitude: number, longitude: number }[] = [];
  userMarker: { latitude: number, longitude: number } | null = null;
  isViewMode: boolean = false;
  user: User;
  tourist : Tourist;
  error : EncounterError;
  expandedEncounterId?: number;
  selectedFilter?: any;
  completed?: number[];
  isActive: boolean = false;
  completedEncounters: Encounter[] = [];
  selectedTab: number = 1;
  
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(
    private dialog: MatDialog,
    private service: EncounterExecutionService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tourService: TourService
  ){}

  ngOnInit(): void {
    console.log("ovo su parametri koje sam dobio", this.route.snapshot.paramMap.get('encounterExecutionId'), this.route.snapshot.paramMap.get('tourExecutionId') );
    console.log("active execution:", this.activeExecutionId);
    if(this.route.snapshot.paramMap.get('encounterExecutionId')!= null && this.route.snapshot.paramMap.get('tourExecutionId') != null ){
      this.activeExecutionId =Number(this.route.snapshot.paramMap.get('encounterExecutionId'));
      this.tourExecutionId = Number(this.route.snapshot.paramMap.get('tourExecutionId'));
      this.isActive = true;
    }

    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user.role == 'tourist') {
        this.tourService.getTouristById(user.id).subscribe({
          next: (result: Tourist) => {
            this.tourist = result;
            if (this.tourist.location) {
              this.userMarker = {
                latitude: this.tourist.location.latitude,
                longitude: this.tourist.location.longitude
              };
              console.log(this.tourist)
              this.emitCoordinates();
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        })
      }
    });
    this.getCompletedEncounters();
    this.getEncounters();
    this.getEncounterTourist();
  };

  onLocationChanged(location: { latitude: number; longitude: number }): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
  
      if (this.user.role === 'tourist') {
        this.tourService.getTouristById(user.id).subscribe({
          next: (result: Tourist) => {
            this.tourist = result;
  
            if (this.tourist.location) {
              // Ažuriranje koordinata turiste
              this.tourist.location.latitude = location.latitude;
              this.tourist.location.longitude = location.longitude;
  
              // Pozivanje servisa za ažuriranje turiste u bazi
              this.tourService.updateTourist(this.tourist).subscribe({
                next: () => {
                  console.log('Coordinates updated successfully');
                  this.emitCoordinates();
                },
                error: (err: any) => {
                  console.log('Error updating tourist:', err);
                }
              });
            }
          },
          error: (err: any) => {
            console.log('Error fetching tourist:', err);
          }
        });
      }
    });
    this.selectedFilter = 3;  
    this.filterEncounters(undefined, undefined, location.latitude, location.longitude);
  }

  filterEncounters(name?: string, type?: number, userLatitude?: number, userLongitude?: number): void {
    // Postavite selektovani filter
    if (name === undefined && type === undefined && userLatitude !== undefined && userLongitude !== undefined) {
      this.selectedFilter = 3; // Filter prema lokaciji
    } else {
      this.selectedFilter = type; // Filter prema tipu, ako postoji
    }
  
    // Kreirajte objekat parametara dinamički za slanje na server
    const params: any = {};
  
    if (name) {
      params.name = name; // Dodajte ime ako je definisano
    }
  
    if (type !== undefined) {
      params.type = type; // Dodajte tip ako je definisan
    }
  
    if (userLatitude !== undefined && userLongitude !== undefined) {
      params.userLatitude = userLatitude;
      params.userLongitude = userLongitude;
    }
  
    // Pozivajte API za pretragu i filtriranje
    this.service.searchAndFilter(params).subscribe({
      next: (result) => {
        // Ažurirajte filtrirane encountere prema vraćenim rezultatima
        this.filteredEncounters = result.results.filter((encounter: Encounter) => {
          // Ako je ime prosleđeno, filtrirajte prema nazivu (case-insensitive)
          if (name) {
            return encounter.name.toLowerCase().includes(name.toLowerCase());
          }
          return true; // Ako nema imena, ne filtrirajte
        });
  
        // Ažurirajte koordinate za mapu
        this.encounterCoordinates = this.filteredEncounters.map(e => ({
          latitude: e.encounterLocation.latitude,
          longitude: e.encounterLocation.longitude,
        }));
  
        this.emitCoordinates(); // Emitujte koordinate za mapu
      },
      error: (err) => {
        console.error('Error during filtering:', err);
      }
    });
  }
  
  onSearch(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim(); // Uzimanje vrednosti iz polja za unos
    this.filterEncounters(input); // Filtrirajte Encounter-e po nazivu
  }

  toggleExpand(encounterId?: number): void {
    if (this.expandedEncounterId === encounterId) {
      this.expandedEncounterId = 0; // Sklanja proširenje ako je već prošireno
    } else {
      this.expandedEncounterId = encounterId; // Postavlja ID proširene kartice
    }
  }

  navigateToForm(id?: number): void {
    console.log('usao je u navigate to form');
    if (id) {
      this.openFormModal(id);
     // this.router.navigate(['/encounter-update', id]);
    } else {
      //otvara se modal
      this.openFormModal();
      //this.router.navigate(['/encounter-add']);
    }
  }

  openFormModal(id?: number): void {
    const dialogRef = this.dialog.open(EncounterFormComponent, {
      data: { encounterId: id }
    });

    // dialogRef.componentInstance.closeDialog = () => {
    //   dialogRef.close(); // Close the dialog when called from the modal
    // };
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal zatvoren', result);
    });
  }
  

  Execute(encounter:Encounter): void {
    
    const execution: Execution = {
      userId: this.user.id, 
      encounterId: encounter.id || 0,
      isComplete: false,
      encounterType: encounter.encounterType, 
      userLongitude: this.tourist.location.longitude, 
      userLatitude: this.tourist.location.latitude, 
      participants: 0 
    };
    
    this.service.findExecution(execution.userId, execution.encounterId).subscribe(
      (ex: Execution | null) => {
        if (ex) {
          console.log('Execution found:', ex);
          this.activeExecutionId = ex.id || -1;
          this.isActive = true;
          //this.router.navigate(['/encounter-execution', ex.id]);
        } else {
          console.log('Execution not found.');
          this.CreateExecution(execution);
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
    
  }
  
  CreateExecution(execution:Execution ):void{
    this.service.addEncounterExecution(execution).subscribe({
      next: (response) => {
        const encounterExecutionId = response.id;
        console.log(encounterExecutionId);
        if (encounterExecutionId) {
          //this.router.navigate(['/encounter-execution',encounterExecutionId]);

          this.activeExecutionId = encounterExecutionId;
          this.isActive = true;
          console.log(this.activeExecutionId);
        } else {
          console.error('EncounterExecution ID not found in response.');
        }
      },
      error: (err) => {
        console.error('Failed to create EncounterExecution:', err);
        this.error = {errorMessage: "Morate biti na lokaciji izazova",encounterId:execution.encounterId}
        this.expandedEncounterId = execution.encounterId;
      }
    });
  }

  getEncounters(): void {
    let encounterObservable;

    switch (this.user.role) {
      case 'administrator':
        encounterObservable = this.service.getEncounters();
        break;
      case 'tourist':
        encounterObservable = this.service.touristGetEncounters();
        break;
      case 'author':
        console.warn('Author nema dozvolu da pristupi encounterima.');
        return;
      default:
        console.warn(`Nepoznata uloga korisnika: ${this.user.role}`);
        return;
    }

    encounterObservable.subscribe({
      next: (data) => {
        const activeEncounters = this.user.role === 'tourist' 
          ? data.results.filter(e => e.encounterStatus === 0 && e.id && !this.completed?.includes(e.id)) 
          : data.results.filter(e => e.encounterStatus === 0 || e.encounterStatus === 3);
        const completedEncounters = this.user.role === 'tourist'
          ? data.results.filter(e => e.encounterStatus === 0 && e.id && this.completed?.includes(e.id)) 
          : [];

        this.encounters = activeEncounters;
        this.completedEncounters = completedEncounters;
        console.log("aktivni encounteri za prikaz:", this.encounters);
        console.log("reseni encounteri za prikaz:", this.completedEncounters);
        this.filteredEncounters = this.encounters; // Prikaz svih encounter-a inicijalno
        this.encounterCoordinates = this.filteredEncounters.map(e => ({
          latitude: e.encounterLocation.latitude,
          longitude: e.encounterLocation.longitude
        }));
        this.encounterCoordinatesLoaded.emit(this.encounterCoordinates);
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja encounter-a:', err);
      }
    });
  }

  emitCoordinates(): void {
    const allCoordinates = [...this.encounterCoordinates];
    if (this.userMarker) {
      allCoordinates.push(this.userMarker);
    }
    this.encounterCoordinatesLoaded.emit(allCoordinates);
  }

  getEncounterTourist(): void {
    this.authService.getTourist(this.user.id).subscribe({
      next: (result: EncounterTourist) => {
        this.encounterTourist = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  get canAddEncounter(): boolean {
    return this.user.role === 'administrator' || 
           (this.user.role === 'tourist' && this.encounterTourist?.level >= 10);
  }
  approveEncounter(id?: number): void {
    if (!id) {
      console.error("No ID provided for approval");
      return;
    }
  
    this.service.getEncounter(id).subscribe({
      next: (encounter) => {
        encounter.encounterStatus = 0;
  
        this.service.updateEncounter(encounter).subscribe({
          next: (updatedEncounter) => {
  
            // Ažuriranje liste encounters
            const index = this.encounters.findIndex(e => e.id === updatedEncounter.id);
            if (index !== -1) {
              this.encounters[index] = updatedEncounter; 
            } else {
              this.encounters.push(updatedEncounter);
            }
          },
          error: (err) => {
            console.error("Error updating encounter:", err);
          }
        });
      },
      error: (err) => {
        console.error("Error retrieving encounter:", err);
      }
    });
  }
  declineEncounter(id?: number): void {
    if (!id) {
      console.error("No ID provided for decline");
      return;
    }
  
    this.service.getEncounter(id).subscribe({
      next: (encounter) => {
        encounter.encounterStatus = 4; // Postavljanje statusa na "Declined"
  
        this.service.updateEncounter(encounter).subscribe({
          next: (updatedEncounter) => {
  
            // Uklanjanje encounter-a iz liste
            const index = this.encounters.findIndex(e => e.id === updatedEncounter.id);
            if (index !== -1) {
              this.encounters.splice(index, 1);
            }
          },
          error: (err) => {
            console.error("Error updating encounter:", err);
          }
        });
      },
      error: (err) => {
        console.error("Error retrieving encounter:", err);
      }
    });
  }
  navigateToPositionSimulator(){
    this.router.navigate(["position-sim"])
  }

  getCompletedEncounters(): void{
    this.service.getAllEncounterIdsByUserId(this.user.id).subscribe({
      next: (result) => {
        this.completed = result;
        console.log("completed ids:", this.completed);
      },
      error: (err) => {
        console.error("Error geting completed encounters:", err);
      }
    })
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }
}

