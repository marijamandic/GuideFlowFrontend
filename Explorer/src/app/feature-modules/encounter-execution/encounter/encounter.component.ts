import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EncounterExecutionService } from '../encounter-execution.service';
import { Encounter } from '../model/encounter.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { Execution } from '../model/execution.model';
import { EncounterTourist } from '../model/encounter-tourist.model';
import { EncounterError } from '../model/encounter-error';
import { EncounterSearch } from '../model/encounter-search.model';

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
  encounterCoordinates: { latitude: number, longitude: number }[] = [];
  userMarker: { latitude: number, longitude: number } | null = null;
  isViewMode: boolean = false;
  user: User;
  tourist : Tourist;
  error : EncounterError;
  expandedEncounterId?: number;
  selectedFilter?: number;
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(private service: EncounterExecutionService, private router: Router, private authService: AuthService, private tourService: TourService,){}

  ngOnInit(): void {
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
    this.getEncounters();
    this.getEncounterTourist();

  };

  filterEncounters(type?: number): void {
    this.selectedFilter = type; // Postavlja selektovani filter

    // Kreirajte objekat parametara koji odgovara EncounterSearch
    const params: EncounterSearch = {
        name: "",
        userLatitude: this.tourist?.location?.latitude || 0, // Prosledite korisničku lokaciju ako postoji
        userLongitude: this.tourist?.location?.longitude || 0 // Isto za longitude
    };

    // Dodajte `type` samo ako je definisan
    if (type !== undefined) {
        params.type = type;
    }

    // Pozovite servis sa ispravnim parametrima
    this.service.searchAndFilter(params).subscribe({
        next: (result) => {
            this.filteredEncounters = result.results; // Ažurirajte listu encounter-a
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

  toggleExpand(encounterId?: number): void {
    if (this.expandedEncounterId === encounterId) {
      this.expandedEncounterId = 0; // Sklanja proširenje ako je već prošireno
    } else {
      this.expandedEncounterId = encounterId; // Postavlja ID proširene kartice
    }
  }

  navigateToForm(id?: number): void {
    if (id) {
      this.router.navigate(['/encounter-update', id]);
    } else {
      this.router.navigate(['/encounter-add']);
    }
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
          console.log(this.activeExecutionId);
        } else {
          console.error('EncounterExecution ID not found in response.');
        }
      },
      error: (err) => {
        console.error('Failed to create EncounterExecution:', err);
        this.error = {errorMessage: "Morate biti na lokaciji izazova",encounterId:execution.encounterId}
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
          ? data.results.filter(e => e.encounterStatus === 0) 
          : data.results.filter(e => e.encounterStatus === 0 || e.encounterStatus === 3);

        this.encounters = activeEncounters;
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
}
