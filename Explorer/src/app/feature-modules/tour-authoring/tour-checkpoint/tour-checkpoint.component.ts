import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { TourCheckpointService } from '../tour-checkpoint.service';
import { Checkpoint } from '../model/tourCheckpoint.model';

@Component({
  selector: 'xp-checkpoint-list',
  templateUrl: './tour-checkpoint.component.html',
  styleUrls: ['./tour-checkpoint.component.css']
})
export class CheckpointListComponent implements OnInit {
  checkpoints: Checkpoint[] = [];
  editingCheckpoint: Checkpoint | null = null; 
  checkpointForm: FormGroup; 
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  isAddingCheckpoint = false;
  newCheckpoint = { id: 0, name: '', description: '', imageUrl: '', latitude: 0, longitude: 0 };

  toggleAddCheckpointForm() {
    this.isAddingCheckpoint = !this.isAddingCheckpoint;
  }

  

  addCheckpoint(): void {
      const formValues = this.newCheckpoint;

      if (!this.newCheckpoint || this.newCheckpoint.id === 0) {
        // Ako checkpoint ne postoji, kreiraj novi
        const newCheckpoint: Checkpoint = { ...formValues };
        console.log('Creating new checkpoint:', newCheckpoint);

        this.checkpointService.addCheckpoint(formValues).subscribe({
          next: () => {
            console.log('New checkpoint added.');
          },
          error: (err) => console.error('Error adding checkpoint:', err)
        });
  
      } else {
        const updatedCheckpoint: Checkpoint = {
          ...formValues,
          id: this.newCheckpoint.id 
        };
        console.log('Updating existing checkpoint:', this.newCheckpoint);

        this.checkpointService.updateCheckpoint(formValues).subscribe({
          next: () => {
            console.log('Checkpoint updated.');
          },
          error: (err) => console.error('Error updating checkpoint:', err)
        });
    }
  }
  resetNewCheckpointForm() {
    this.newCheckpoint = { id: 0, name: '', description: '', imageUrl: '', latitude: 0, longitude: 0 };
    this.isAddingCheckpoint = false;
  }
  
  constructor(private checkpointService: TourCheckpointService, private fb: FormBuilder) {
    this.checkpointForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCheckpoints();
  }

  loadCheckpoints(page: number = 1, pageSize: number = 10): void {
    this.checkpointService.getCheckpoints(page, pageSize).subscribe({
      next: (data) => {
        this.checkpoints = data.results; 
        console.log(this.checkpoints);
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

  // U tvojoj roditeljskoj komponenti
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
      longitude: coordinates.longitude
    };
  }
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
