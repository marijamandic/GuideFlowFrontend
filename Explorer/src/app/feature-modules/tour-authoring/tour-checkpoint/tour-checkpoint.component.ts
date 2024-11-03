import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { TourCheckpointService } from '../tour-checkpoint.service';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { ApprovalStatus, PointType, PublicPoint } from '../model/publicPoint.model';
import { PublicPointService } from '../tour-public-point.service';

@Component({
  selector: 'xp-checkpoint-list',
  templateUrl: './tour-checkpoint.component.html',
  styleUrls: ['./tour-checkpoint.component.css']
})
export class CheckpointListComponent implements OnInit {
  checkpoints: Checkpoint[] = [];
  editingCheckpoint: Checkpoint | null = null; 
  checkpointForm: FormGroup; 
  checkpointCoordinates: { latitude: number, longitude: number }[] = [];
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  isAddingCheckpoint = false;
  selectedTour: string = 'tour1'; 
  newCheckpoint = { id: 0, name: '', description: '', imageUrl: '', latitude: 0, longitude: 0, secret: ''};
  isChecked: boolean = false; 

  toggleAddCheckpointForm() {
    this.isAddingCheckpoint = !this.isAddingCheckpoint;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.newCheckpoint.imageUrl = reader.result as string; // Postavlja Base64 URL slike
      };
    }
  }

  onIsCheckedChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked; 
  }
  
  addCheckpoint(): void {
    if(this.isChecked) {
      console.log("JAvna")
      this.createPublicObject()
    } else {
      if (!this.newCheckpoint || this.newCheckpoint.id === 0) {
        this.createNewCheckpoint();
      } else {
        this.updateExistingCheckpoint();
      }
    }
    
  }
  
  private createNewCheckpoint(): void {
    const newCheckpoint: Checkpoint = { ...this.newCheckpoint };
    console.log('Creating new checkpoint:', newCheckpoint);
  
    this.checkpointService.addCheckpoint(newCheckpoint).subscribe({
      next: () => {
        console.log('New checkpoint added.');
        this.loadCheckpoints();
        this.resetNewCheckpointForm();
      },
      error: (err) => console.error('Error adding checkpoint:', err)
    });
  }
  
  private updateExistingCheckpoint(): void {
    const updatedCheckpoint: Checkpoint = { ...this.newCheckpoint };
    console.log('Updating existing checkpoint:', updatedCheckpoint);
  
    this.checkpointService.updateCheckpoint(updatedCheckpoint).subscribe({
      next: () => {
        console.log('Checkpoint updated.');
        this.loadCheckpoints();
        this.resetNewCheckpointForm();
      },
      error: (err) => console.error('Error updating checkpoint:', err)
    });
  }
  
  resetNewCheckpointForm() {
    this.newCheckpoint = { id: 0, name: '', description: '', imageUrl: '', latitude: 0, longitude: 0, secret: '' };
    this.isAddingCheckpoint = false;
  }
  
  constructor(private checkpointService: TourCheckpointService, private fb: FormBuilder, private publicPointService: PublicPointService) {
    this.checkpointForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      secret: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCheckpoints();
  }
  loadCheckpointsMap() {
    if (this.selectedTour == 'tour1') {
      this.checkpointService.getCheckpointsByTour(1).subscribe({
        next: (data) => {
          this.checkpoints = data; 
          this.checkpointCoordinates = this.checkpoints.map(cp => ({ latitude: cp.latitude, longitude: cp.longitude }));
          console.log(this.checkpoints)
          this.checkpointsLoaded.emit(this.checkpointCoordinates); // Emitovanje koordinata
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
        });
    } else {
      this.checkpointService.getCheckpointsByTour(0).subscribe({
        next: (data) => {
          this.checkpoints = data; 
          this.checkpointCoordinates = this.checkpoints.map(cp => ({ latitude: cp.latitude, longitude: cp.longitude }));
          this.checkpointsLoaded.emit(this.checkpointCoordinates); // Emitovanje koordinata
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
        });
    }
  }
  
  loadCheckpoints(page: number = 1, pageSize: number = 10): void {
    this.checkpointService.getCheckpoints(page, pageSize).subscribe({
      next: (data) => {
        this.checkpoints = data.results; 
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja checkpoint-a:', err);
      }
    });
  }

  editCheckpoint(checkpoint: Checkpoint): void {
    this.toggleAddCheckpointForm()
    this.newCheckpoint.description = checkpoint.description
    this.newCheckpoint.name = checkpoint.name
    this.newCheckpoint.imageUrl = checkpoint.imageUrl || ''
    this.newCheckpoint.latitude = checkpoint.latitude
    this.newCheckpoint.longitude = checkpoint.longitude
    this.newCheckpoint.id = checkpoint.id || 0
    this.newCheckpoint.secret = checkpoint.secret || ''
    this.editingCheckpoint = checkpoint; 
    this.loadFormData(checkpoint); 
  }

  loadFormData(checkpoint: Checkpoint): void {
    this.checkpointForm.patchValue({
      name: checkpoint.name,
      description: checkpoint.description,
      imageUrl: checkpoint.imageUrl,
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude
    });
  }

onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
  this.newCheckpoint.latitude = coordinates.latitude
  this.newCheckpoint.longitude = coordinates.longitude
  // Ažuriramo editingCheckpoint sa novim koordinatama
  if (this.editingCheckpoint) {
    this.editingCheckpoint.latitude = coordinates.latitude;
    this.editingCheckpoint.longitude = coordinates.longitude;
  } else {
    // Ako nema trenutno izabranog checkpointa, kreiramo novi
    this.editingCheckpoint = {
      name: '',
      description: '',
      imageUrl: '',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      secret: ''
    };
  }
}

createPublicObject(): void {
  const publicObject: PublicPoint = {
      id: 0, 
      name: this.newCheckpoint.name || "",
      description: this.newCheckpoint.description || "",
      latitude: this.newCheckpoint.latitude || 0,
      longitude: this.newCheckpoint.longitude || 0,
      imageUrl: this.newCheckpoint.imageUrl || "",
      approvalStatus: ApprovalStatus.Pending, 
      type: PointType.Checkpoint
  };

  this.publicPointService.addPublicPoint(publicObject).subscribe({
      next: (_) => {
          this.checkpointsLoaded.emit();
          console.log('Public object successfully created');
      },
      error: (err) => {
          console.error('Error creating public object:', err);
      }
  });
}
  



  deleteCheckpoint(checkpoint: Checkpoint): void {
    if (checkpoint.id !== undefined) {
      this.checkpointService.deleteCheckpoint(checkpoint.id).subscribe({
        next: () => {
          this.checkpoints = this.checkpoints.filter(c => c.id !== checkpoint.id);
          console.log('Checkpoint deleted with ID:', checkpoint.id);
        },
        error: (err: any) => {
          console.error('Error deleting checkpoint:', err);
        }
      });
    } else {
      console.error('Checkpoint ID is undefined, cannot delete.');
    }
  }
}
