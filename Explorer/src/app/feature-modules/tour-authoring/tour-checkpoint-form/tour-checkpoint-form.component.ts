import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { TourCheckpointService } from '../tour-checkpoint.service';

@Component({
  selector: 'xp-tour-checkpoint-form',
  templateUrl: './tour-checkpoint-form.component.html',
  styleUrls: ['./tour-checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges {
  
  @Input() checkpoint: Checkpoint | null = null;
  @Output() updatedCheckpoint = new EventEmitter<null>();
  checkpointForm: FormGroup;

  constructor(private fb: FormBuilder, private service: TourCheckpointService) {
    this.checkpointForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required]
    });
  }

  ngOnChanges(): void {
    if (this.checkpoint) {
      this.checkpointForm.patchValue({
        name: this.checkpoint.name || '',
        description: this.checkpoint.description || '',
        imageUrl: this.checkpoint.imageUrl || '',
        latitude: this.checkpoint.latitude || 0,
        longitude: this.checkpoint.longitude || 0
      });
    }
  }

  addCheckpoint(): void {
    if (this.checkpointForm.valid) {
      const formValues = this.checkpointForm.value;
  
      if (!this.checkpoint || this.checkpoint.id === undefined) {
        // Kreiraj novi checkpoint iz forme
        const newCheckpoint: Checkpoint = { ...formValues };
        console.log('Creating new checkpoint:', newCheckpoint);

        this.service.addCheckpoint(newCheckpoint).subscribe({
          next: () => {
            console.log('New checkpoint added.');
            this.updatedCheckpoint.emit()
            this.resetForm(); // Resetuje formu nakon dodavanja
          },
          error: (err) => console.error('Error adding checkpoint:', err)
        });
  
      } else {
        // Ažuriraj postojeći checkpoint
        const updatedCheckpoint: Checkpoint = {
          ...formValues,
          id: this.checkpoint.id 
        };
        console.log('Updating existing checkpoint:', updatedCheckpoint);

        this.service.updateCheckpoint(updatedCheckpoint).subscribe({
          next: () => {
            console.log('Checkpoint updated.');
            this.updatedCheckpoint.emit()
            this.resetForm(); // Resetuje formu nakon ažuriranja
          },
          error: (err) => console.error('Error updating checkpoint:', err)
        });
      }
    }
  }

  // Resetovanje forme nakon uspešne operacije
  resetForm(): void {
    this.checkpointForm.reset();
    this.checkpoint = null; // Resetuje trenutni checkpoint
  }
}
