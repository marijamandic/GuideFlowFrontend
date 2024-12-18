import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Encounter } from '../model/encounter.model';
import { EncounterExecutionService } from '../encounter-execution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from '../../layout/alert.service';

export enum EncounterStatus {
  Active = 'Active',
  Draft = 'Draft',
  Archieved = 'Archieved',
  Pending = 'Pending'
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
 // @Input() encounterId?: number;
  mapMode: 'encounterLocation' | 'imageLocation' = 'encounterLocation';
  typeSelected: boolean = false;
  user: User;
  encounterTypes = Object.keys(EncounterType).filter((key) => isNaN(Number(key)));
  selectedType: string | null = null;
  selectedFile: File | null = null;
  encounterId: number;
//  @Input() closeDialog: () => void;
//  @Output() closeModal = new EventEmitter<void>(); // Emiter za zatvaranje modala
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  isEncounterId: boolean = false;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {encounterId: number},
    private dialogRef: MatDialogRef<EncounterFormComponent>,
    private encounterService: EncounterExecutionService,
    private authService: AuthService, 
    private router: Router, 
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{
      this.user = user;
    })
    this.encounterId = this.data.encounterId;
    // if (this.encounterId) {
    //   this.encounterService.getEncounter(this.encounterId).subscribe(
    //     (encounter: Encounter) => {
    //       this.encounter = encounter;
    //     }
    //   );
    // }
    this.loadEncounter();
  }

  loadEncounter(): void {
    if (this.encounterId) {
      this.encounterService.getEncounter(this.encounterId).subscribe({
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
  }

  setMapMode(mode: 'encounterLocation' | 'imageLocation'): void {
    this.mapMode = mode;
    console.log('Map mode switched to:', this.mapMode);
  }

  onEncounterTypeChange(): void {
    // Resetovanje nepotrebnih polja
    this.encounter = {
      ...this.encounter,
      touristNumber: undefined,
      encounterRange: undefined,
      imageUrl: undefined,
      activationRange: undefined,
      actionDescription: undefined,
      imageLatitude: undefined,
      imageLongitude: undefined,
      imageBase64: undefined
    };

    // Podesavanje tipa izazova
    this.encounter.encounterType = this.mapToType(this.selectedType);
    this.encounter.$type = this.mapToDiscriminatorType(this.selectedType);
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach((field) => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return; // Zaustavi slanje forme ako je nevalidna
    }

    if (this.encounter.encounterType == this.mapToType("Location") && !this.selectedFile) {
      // Ako fajl nije selektovan, ručno oznaci input kao nevalidan
      this.alertService.showAlert('File is required', "error", 5);
      return;
    }

    if (!this.encounter.encounterLocation.latitude || !this.encounter.encounterLocation.longitude) {
      this.alertService.showAlert('Encounter coordinates are required', "error", 5);
      return;  // Prekida slanje forme ako koordinate nisu unete
    }

    if (this.encounter.encounterType == this.mapToType("Location") && (!this.encounter.imageLatitude || !this.encounter.imageLongitude)) {
      this.alertService.showAlert('Image coordinates are required', "error", 5);
      return;  // Prekida slanje forme ako image koordinate nisu unete
    }

    const typeMap = {
        0: 'socialEncounter',
        1: 'locationEncounter',
        2: 'miscEncounter',
  };
    if(this.user.role != 'tourist'){
      this.encounter.encounterStatus = this.ConvertStatus();
    }
    else{
      this.encounter.encounterStatus = 3;
    }

    this.encounter.$type = typeMap[this.encounter.encounterType];
    console.log(this.encounter.$type)

    const finalPayload = {
      $type: this.encounter.$type,
      ...this.encounter
    };

    console.log('Final payload:', JSON.stringify(this.encounter));

    if (this.encounter.id) {
        this.updateEncounter(finalPayload);
        this.onCloseModal();
    } else {
        this.addEncounter();
        this.onCloseModal();
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

  onFileSelected(event: any): void {
     this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.encounter.imageBase64 = reader.result as string;
       // this.encounter.imageUrl = this.selectedFile?.name;
       // console.log('Image uploaded with URL:', this.encounter.imageUrl);
      };
    }
  }

onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
  if (this.mapMode === 'encounterLocation') {
    this.encounter.encounterLocation.latitude = coordinates.latitude;
    this.encounter.encounterLocation.longitude = coordinates.longitude;
    console.log('Encounter Location updated:', this.encounter.encounterLocation);
  } else if (this.mapMode === 'imageLocation') {
    this.encounter.imageLatitude = coordinates.latitude;
    this.encounter.imageLongitude = coordinates.longitude;
    console.log('Image Location updated:', { latitude: this.encounter.imageLatitude, longitude: this.encounter.imageLongitude });
  }
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

  mapToDiscriminatorType(type:string | null): string{
    switch (type) {
      case  "Social" :
        return "socialEncounter";
      case "Location":
        return "locationEncounter";
      case "Misc":
        return "miscEncounter";
      default:
        return "base"; 
    }
  }

  mapToType(type:string | null): number{
    switch (type) {
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

  onCloseModal() {
   // event.stopPropagation(); // Sprečava propagaciju događaja i sprečava pokretanje validacije
    //this.closeModal.emit(); // Emituj događaj za zatvaranje
    this.dialogRef.close();
  }
}
