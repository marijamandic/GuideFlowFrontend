import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { PublicPoint,ApprovalStatus,PointType } from '../model/publicPoint.model';
import { TourCheckpointService } from '../tour-checkpoint.service';
import { PublicPointService } from '../tour-public-point.service';
import { TourService } from '../tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-tour-checkpoint-form',
  templateUrl: './tour-checkpoint-form.component.html',
  styleUrls: ['./tour-checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges {
  
  @Input() checkpoint: Checkpoint;
  @Input() tourId!:number;
  @Input() shouldEdit: boolean = false;
  @Output() updatedCheckpoint = new EventEmitter<void>();
  checkpointCoordinates: { latitude: number; longitude: number; name: string; description: string; imageUrl?: string; };
  isChecked: boolean = false; 
  isViewMode:boolean = true;
  imageBase64:string;
  user : User;
  publicPoint : PublicPoint;

  constructor(private authService: AuthService,private tourService:TourService,private publicPointService: PublicPointService) {}

  ngOnChanges(): void {
    this.checkpointForm.reset();
    if (this.shouldEdit) {
      this.checkpointForm.patchValue(this.checkpoint);
      this.checkpointCoordinates = {
        latitude: this.checkpoint.latitude,
        longitude: this.checkpoint.longitude,
        name: this.checkpoint.name,
        description: this.checkpoint.description,
        imageUrl: this.getImagePath(this.checkpoint.imageUrl)
      };
    }
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
  }

  getImagePath(imageUrl: string | undefined){
    if(imageUrl!==undefined){
      return environment.webRootHost+imageUrl;
    }
    return "";
  }

  checkpointForm = new FormGroup({
    name:new FormControl('',[Validators.required]),
    description:new FormControl('', [Validators.required]),
    imageUrl:new FormControl('', [Validators.required]),
    imageBase64:new FormControl('', [Validators.required]),
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
        this.imageBase64 = reader.result as string;
        this.checkpointForm.patchValue({
          imageBase64: this.imageBase64
        });
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
      
      if (!this.shouldEdit) {
        const checkpoint: Checkpoint = {
          name: this.checkpointForm.value.name || "",
          description:this.checkpointForm.value.description || "",
          imageUrl:this.checkpointForm.value.imageUrl || "",
          imageBase64:this.checkpointForm.value.imageBase64 || "",
          latitude:this.checkpointForm.value.latitude || 0,
          longitude:this.checkpointForm.value.longitude || 0,
          secret:this.checkpointForm.value.secret || "",
          isEncounterEssential:false
        };
        console.log(checkpoint);
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
          imageBase64:this.checkpointForm.value.imageBase64 || "",
          latitude:this.checkpointForm.value.latitude || 0,
          longitude:this.checkpointForm.value.longitude || 0,
          secret:this.checkpointForm.value.secret || "",
          isEncounterEssential:false
        };
        checkpoint.id=this.checkpoint.id;
        this.tourService.updateCheckpoint(this.tourId,checkpoint).subscribe({
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
        imageBase64:this.checkpointForm.value.imageBase64 || "",
        approvalStatus: ApprovalStatus.Pending,
        authorId: this.user.id, 
        type: PointType.Checkpoint
    };
    this.publicPointService.addPublicPoint(publicObject).subscribe({
        next: (_) => {
            console.log('Public object successfully created');
            this.updatedCheckpoint.emit();
        },
        error: (err) => {
            console.error('Error creating public object:', err);
        }
    });
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    console.log(coordinates.latitude,coordinates.longitude);
    this.checkpointForm.patchValue({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    });
  }

  handlePublicPointSelection(point: any): void {
    console.log('Selected Public Point:', point);

    this.checkpointForm.patchValue({
        name: point.name || '',         
        description: point.description || '', 
        latitude: point.latitude,       
        longitude: point.longitude,     
        imageUrl: point.imageUrl || ''
    });
  } 
}
