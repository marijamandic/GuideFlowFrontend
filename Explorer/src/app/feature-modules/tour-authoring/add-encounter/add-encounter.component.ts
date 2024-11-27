import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EncounterExecutionService } from '../../encounter-execution/encounter-execution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Encounter } from '../../encounter-execution/model/encounter.model';
import { TourCheckpointService } from '../tour-checkpoint.service';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { TourService } from '../tour.service';

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
  selector: 'xp-add-encounter',
  templateUrl: './add-encounter.component.html',
  styleUrls: ['./add-encounter.component.css']
})
export class AddEncounterComponent implements OnInit {
  checkpointId : number;
  tourId : number;
  encounterTypes = Object.keys(EncounterType).filter((key) => isNaN(Number(key)));
  encounterStatuses = Object.keys(EncounterStatus).filter((key) => isNaN(Number(key)));
  selectedType: string | null = null;
  isEssential: boolean;
  checkpoint : Checkpoint;
  encounter: Encounter = {
    $type: '',
    name: '',
    description: '',
    encounterStatus: 0,
    encounterLocation: { latitude: 0, longitude: 0 },
    experiencePoints: 0,
    encounterType: 0
  };

  encounterCoordinates: { latitude: number; longitude: number }[] = [];
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(private tourService: TourService,private checkpointService : TourCheckpointService,private encounterService : EncounterExecutionService,private router : Router , private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.checkpointId = params['id'];
      this.tourId = params['tourId'];
    });
    this.checkpointService.getCheckpointById(this.checkpointId).subscribe({
      next: (checkpoint: Checkpoint) => {
        this.checkpoint = checkpoint;

        // Popunjavanje lokacije izazova na osnovu lokacije checkpointa
        if (checkpoint) {
          this.encounter.encounterLocation.latitude = checkpoint.latitude;
          this.encounter.encounterLocation.longitude = checkpoint.longitude;
        }
      },
      error: (error) => {
        console.error('Greška prilikom dobijanja checkpointa:', error);
      }
    });
  }
  submitEncounter() {
    console.log('Kreirani izazov:', this.encounter);
    this.encounter.encounterStatus = this.ConvertStatus(this.encounter.encounterStatus.toString());
    this.encounterService.authorAddEncounter(this.encounter).subscribe({
      next: (result) => {
        this.encounter = result;
        this.checkpoint.encounterId = this.encounter.id;
        this.checkpoint.isEncounterEssential = this.isEssential;
        this.tourService.updateCheckpoint(this.tourId,this.checkpoint).subscribe({
          next: () => {
            console.log("uspesno izmenjen checkpoint");
            this.router.navigate(["tourDetails",this.tourId])
          },
          error: (err) => console.error(err),
        })
      },
      error: (err) => console.error(err),
    });
  }
  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
      this.encounter.imageLatitude = coordinates.latitude;
      this.encounter.imageLongitude = coordinates.longitude;
      console.log('Image Location updated:', { latitude: this.encounter.imageLatitude, longitude: this.encounter.imageLongitude });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.encounter.imageBase64 = reader.result as string;
      };
    }
  }

  onTypeChange() {
    // Resetovanje nepotrebnih polja
    this.encounter = {
      ...this.encounter,
      touristNumber: undefined,
      encounterRange: undefined,
      imageUrl: undefined,
      activationRange: undefined,
      checkpointId: this.checkpointId,
      actionDescription: undefined,
      imageLatitude: undefined,
      imageLongitude: undefined,
      imageBase64: undefined
    };

    // Podesavanje tipa izazova
    this.encounter.encounterType = this.mapToType(this.selectedType);
    this.encounter.$type = this.mapToDiscriminatorType(this.selectedType);
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
  ConvertStatus(status : string): number {
     
    switch (status) {
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
