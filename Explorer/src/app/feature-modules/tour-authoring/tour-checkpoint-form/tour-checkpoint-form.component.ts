import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { PublicPoint,ApprovalStatus,PointType } from '../model/publicPoint.model';
import { TourCheckpointService } from '../tour-checkpoint.service';
import { PublicPointService } from '../tour-public-point.service';
import { TourService } from '../tour.service';

@Component({
  selector: 'xp-tour-checkpoint-form',
  templateUrl: './tour-checkpoint-form.component.html',
  styleUrls: ['./tour-checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges {
  
  @Input() checkpoint: Checkpoint | null = null;
  @Input() tourId!:number;
  @Input() shouldEdit: boolean = false;
  @Output() updatedCheckpoint = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  checkpointCoordinates: { latitude: number, longitude: number }[] = [];
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  isChecked: boolean = false; 
  isViewMode:boolean = true;

  constructor(private checkpointService: TourCheckpointService,private tourService:TourService,private publicPointService: PublicPointService) {}

  ngOnChanges(): void {
    this.checkpointForm.reset();
    if (this.checkpoint) {
      this.checkpointForm.patchValue(this.checkpoint);
    }
  }

  checkpointForm = new FormGroup({
    name:new FormControl('',[Validators.required]),
    description:new FormControl('', [Validators.required]),
    imageUrl:new FormControl('', [Validators.required]),
    latitude:new FormControl (0, [Validators.required]),
    longitude:new FormControl(0, [Validators.required]),
    secret:new FormControl('',[Validators.required])
  });

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.checkpointForm.value.imageUrl = reader.result as string;
      };
    }
  }

  onIsCheckedChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked; 
  }

  addCheckpoint(): void {
      if(this.isChecked){
        this.createPublicObject()
        return;
      }
      
      if (!this.checkpoint || this.checkpoint.id === undefined) {

        const checkpoint: Checkpoint = {
          name: this.checkpointForm.value.name || "",
          description:this.checkpointForm.value.description || "",
          imageUrl:this.checkpointForm.value.imageUrl || "",
          latitude:this.checkpointForm.value.latitude || 0,
          longitude:this.checkpointForm.value.longitude || 0,
          secret:this.checkpointForm.value.secret || ""
        };

        this.tourService.addCheckpoint(this.tourId,checkpoint).subscribe({
          next: () => {
            this.updatedCheckpoint.emit();
          },
          error: (err) => console.error('Error adding checkpoint:', err)
        });
  
      } 
      else 
      {
        const checkpoint: Checkpoint = {
          name: this.checkpointForm.value.name || "",
          description:this.checkpointForm.value.description || "",
          imageUrl:this.checkpointForm.value.imageUrl || "",
          latitude:this.checkpointForm.value.latitude || 0,
          longitude:this.checkpointForm.value.longitude || 0,
          secret:this.checkpointForm.value.secret || ""
        };
        checkpoint.id=this.checkpoint.id;
        this.checkpointService.updateCheckpoint(checkpoint).subscribe({
          next: () => {
            console.log('Checkpoint updated.');
            this.updatedCheckpoint.emit();
          },
          error: (err) => console.error('Error updating checkpoint:', err)
        });
      }
  }

  createPublicObject(): void {
    const publicObject: PublicPoint = {
        id: 0, 
        name: this.checkpointForm.value.name || "",
        description: this.checkpointForm.value.description || "",
        latitude: this.checkpointForm.value.latitude || 0,
        longitude: this.checkpointForm.value.longitude || 0,
        imageUrl: this.checkpointForm.value.imageUrl || "",
        approvalStatus: ApprovalStatus.Pending, 
        type: PointType.Checkpoint
    };
    this.publicPointService.addPublicPoint(publicObject).subscribe({
        next: (_) => {
            console.log('Public object successfully created');
        },
        error: (err) => {
            console.error('Error creating public object:', err);
        }
    });
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    this.checkpointForm.patchValue({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    });
  }
}
