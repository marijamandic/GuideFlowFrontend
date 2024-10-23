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
    if (this.editingCheckpoint) {
      this.editingCheckpoint.latitude = coordinates.latitude;
      this.editingCheckpoint.longitude = coordinates.longitude;
  
      // Emitovanje podataka o koordinatama ka formi
      this.coordinatesSelected.emit({ latitude: coordinates.latitude, longitude: coordinates.longitude });
      
      // Ako treba, ažuriraj postojeći checkpoint
      this.editCheckpoint(this.editingCheckpoint);
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
