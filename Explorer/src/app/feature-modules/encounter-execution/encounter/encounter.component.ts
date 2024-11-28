import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EncounterExecutionService } from '../encounter-execution.service';
import { Encounter } from '../model/encounter.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  encounters: Encounter[] = [];
  encounterCoordinates: { latitude: number, longitude: number }[] = [];
  userMarker: { latitude: number, longitude: number } | null = null;
  isViewMode: boolean = false;
  user: User;
  tourist : Tourist;
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
  };

  navigateToForm(id?: number): void {
    if (id) {
      this.router.navigate(['/encounter-update', id]);
    } else {
      this.router.navigate(['/encounter-add']);
    }
  }

  navigateToEncounter(id?: number): void {
    this.router.navigate(['/home']);
  }

  getEncounters(): void {
    let encounterObservable;
  
    // Odredi API poziv na osnovu korisničke uloge
    switch (this.user.role) {
      case 'administrator':
        encounterObservable = this.service.getEncounters();
        break;
      case 'tourist':
        encounterObservable = this.service.touristGetEncounters();
        break;
      case 'author':
        console.warn('Author nema dozvolu da pristupi encounterima.');
        return; // Prekini izvršavanje ako je uloga author
      default:
        console.warn(`Nepoznata uloga korisnika: ${this.user.role}`);
        return; // Prekini izvršavanje za nepoznate uloge
    }
  
    // Procesiraj rezultat API poziva
    encounterObservable.subscribe({
      next: (data) => {
        const activeEncounters = data.results.filter(e => e.encounterStatus === 0);
        this.encounters = activeEncounters;
        this.encounterCoordinates = this.encounters.map(e => ({ 
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
}
