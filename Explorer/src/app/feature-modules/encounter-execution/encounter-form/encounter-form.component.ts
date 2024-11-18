import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum EncounterStatus {
  Active = 'Active',
  Draft = 'Draft',
  Archieved = 'Archieved'
}

@Component({
  selector: 'xp-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})
export class EncounterFormComponent implements OnInit {

  @Output() updatedEncounter = new EventEmitter<void>();
  isViewMode: boolean = true
  @Input() encounterId?: number;
  encounter: Encounter = {
    id: 0,
    name: '',
    description: '',
    encounterStatus: 0,
    encounterLocationDto: { latitude: 0, longitude: 0 },
    experiencePoints: 0
  };
  encounterCoordinates: { latitude: number, longitude: number }[] = [];
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(private encounterService: EncounterExecutionService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const encounterId = params['id'];
      if (encounterId) {
        this.encounterService.getEncounter(encounterId).subscribe(
          (encounter: Encounter) => {
            this.encounter = encounter;
          }
        );
      }
    });
    this.loadEncounter();
  }

  loadEncounter(): void {
    this.route.params.subscribe(params => {
      const encounterId = params['id'];
      if (encounterId) {
        this.encounterService.getEncounter(encounterId).subscribe({
          next: (data) => {
            const currentEncounter = data;
            if (currentEncounter) {
              this.encounter = currentEncounter;
              this.encounterCoordinates = [{
                latitude: this.encounter.encounterLocationDto.latitude,
                longitude: this.encounter.encounterLocationDto.longitude
              }];
              this.encounterCoordinatesLoaded.emit(this.encounterCoordinates);
            } else {
              console.warn('Encounter not found or is empty.');
            }
          },
          error: (err) => {
            console.error('Greška prilikom učitavanja encounter-a:', err);
          }
        });
      } else {
        console.warn('No encounter ID found in route parameters.');
      }
    });
  }


  getEncounter(id: number): void {
    this.encounterService.getEncounter(id).subscribe({
      next: (encounter) => {
        this.encounter = { ...encounter };
      },
      error: (err) => {
        console.error('Error loading encounter:', err);
      }
    });
  }

  onSubmit(): void {
    this.encounter.encounterStatus = this.ConvertStatus();
    if (this.encounter.id) {
      this.updateEncounter();
    } else {
      this.addEncounter();
    }
  }

  addEncounter(): void {
    this.encounterService.addEncounter(this.encounter).subscribe({
      next: (encounter) => {
        console.log('Encounter added successfully:', encounter);
        this.router.navigate(['/encounters']);
      },
      error: (err) => {
        console.error('Error adding encounter:', err);
      }
    });
  }

  updateEncounter(): void {
    this.encounterService.updateEncounter(this.encounter).subscribe({
      next: (encounter) => {
        console.log('Encounter updated successfully:', encounter);
        this.router.navigate(['/encounters']);
      },
      error: (err) => {
        console.error('Error updating encounter:', err);
      }
    });
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    this.encounter.encounterLocationDto.latitude = coordinates.latitude;
    this.encounter.encounterLocationDto.longitude = coordinates.longitude;
  }

  ConvertStatus(): number {
     
    switch (this.encounter.encounterStatus.toString()) {
      case  "Active" :
        return 0;
      case "Draft":
        return 1;
      case "Archieved":
        return 2;
      default:
        return 0; 
    }
  }
}
