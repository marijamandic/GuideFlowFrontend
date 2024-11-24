import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum EncounterStatus {
  Active = 'Active',
  Draft = 'Draft',
  Archieved = 'Archieved'
}

export enum EncounterType {
  Social = 'Social',
  Location = 'Location',
  Misc = 'Misc'
}

@Component({
  selector: 'xp-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})
export class EncounterFormComponent implements OnInit {
  @Output() updatedEncounter = new EventEmitter<void>();
  @Input() encounterId?: number;

  encounter: Encounter = {
    $type: '',
    id: 0,
    name: '',
    description: '',
    encounterStatus: 0,
    encounterLocation: { latitude: 0, longitude: 0 },
    experiencePoints: 0,
    encounterType: 0
  };

  encounterCoordinates: { latitude: number; longitude: number }[] = [];
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
                latitude: this.encounter.encounterLocation.latitude,
                longitude: this.encounter.encounterLocation.longitude
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

  onEncounterTypeChange(): void {
    this.encounter.encounterType = this.ConvertType();
  }

  onSubmit(): void {
    const typeMap = {
        0: 'socialEncounter',
        1: 'locationEncounter',
        2: 'miscEncounter',
  };

    this.encounter.encounterStatus = this.ConvertStatus();

    this.encounter.$type = typeMap[this.encounter.encounterType];
    console.log(this.encounter.$type)

    const finalPayload = {
      $type: this.encounter.$type,
      ...this.encounter
    };

    console.log('Final payload:', JSON.stringify(this.encounter));

    if (this.encounter.id) {
        this.updateEncounter(finalPayload);
    } else {
        this.addEncounter();
    }
  }

  addEncounter(): void {
    this.encounterService.addEncounter(this.encounter).subscribe({
      next: () => this.router.navigate(['/encounters']),
      error: (err) => console.error(err),
    });
  }

  updateEncounter(encounter: any): void {
    this.encounterService.updateEncounter(encounter).subscribe({
      next: () => this.router.navigate(['/encounters']),
      error: (err) => console.error(err),
    });
  }

//   onFileSelected(event: any): void {
//     const file: File = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             this.encounter.imageBase64 = reader.result as string; // Postavi Base64 sadržaj slike
//             console.log('Image successfully loaded:', this.encounter.imageBase64);
//         };
//     }
// }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    this.encounter.encounterLocation.latitude = coordinates.latitude;
    this.encounter.encounterLocation.longitude = coordinates.longitude;
    this.encounter.imageLatitude = coordinates.latitude;
    this.encounter.imageLongitude = coordinates.longitude;
  }

  getEncounter(id: number): void {
    this.encounterService.getEncounter(id).subscribe({
      next: (encounter) => (this.encounter = encounter),
      error: (err) => console.error(err),
    });
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

  ConvertType(): number {
     
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
}
