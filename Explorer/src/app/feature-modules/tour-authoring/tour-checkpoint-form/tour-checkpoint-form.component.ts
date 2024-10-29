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
  
  @Input() checkpoint: Checkpoint | null = null;  // Input za trenutno uređivani checkpoint
  @Input() coordinates: { latitude: number; longitude: number } | null = null;  // Input za koordinate
  @Output() updatedCheckpoint = new EventEmitter<void>();  // Event koji se emituje kad se checkpoint ažurira
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();  // Event za slanje koordinata
  checkpointForm: FormGroup;

  constructor(private fb: FormBuilder, private service: TourCheckpointService) {
    // Kreiranje forme sa validacijama
    this.checkpointForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required]
    });
  }

  // Kada se promene podaci iz parent komponente, ažuriraj formu
  ngOnChanges(): void {
    if (this.checkpoint) {
      // Postavljanje vrednosti iz checkpoint-a u formu
      this.checkpointForm.patchValue({
        name: this.checkpoint.name || '',
        description: this.checkpoint.description || '',
        imageUrl: this.checkpoint.imageUrl || '',
        latitude: this.checkpoint.latitude || 0,
        longitude: this.checkpoint.longitude || 0
      });
    }

    // Ako su prosleđene koordinate, ažuriraj formu sa tim koordinatama
    if (this.coordinates) {
      this.checkpointForm.patchValue({
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude
      });
    }
  }

  // Funkcija za dodavanje ili ažuriranje checkpoint-a
  addCheckpoint(): void {
    if (this.checkpointForm.valid) {
      const formValues = this.checkpointForm.value;

      if (!this.checkpoint || this.checkpoint.id === undefined) {
        // Ako checkpoint ne postoji, kreiraj novi
        const newCheckpoint: Checkpoint = { ...formValues };
        console.log('Creating new checkpoint:', newCheckpoint);

        this.service.addCheckpoint(newCheckpoint).subscribe({
          next: () => {
            console.log('New checkpoint added.');
            this.updatedCheckpoint.emit();  // Emituje se event da je checkpoint kreiran
            this.resetForm();  // Resetovanje forme
          },
          error: (err) => console.error('Error adding checkpoint:', err)
        });
  
      } else {
        // Ako checkpoint postoji, ažuriraj ga
        const updatedCheckpoint: Checkpoint = {
          ...formValues,
          id: this.checkpoint.id 
        };
        console.log('Updating existing checkpoint:', updatedCheckpoint);

        this.service.updateCheckpoint(updatedCheckpoint).subscribe({
          next: () => {
            console.log('Checkpoint updated.');
            this.updatedCheckpoint.emit();  // Emituje se event da je checkpoint ažuriran
            this.resetForm();  // Resetovanje forme
          },
          error: (err) => console.error('Error updating checkpoint:', err)
        });
      }
    }
  }

  // Funkcija za resetovanje forme
  resetForm(): void {
    this.checkpointForm.reset();
    this.checkpoint = null;  // Resetuje trenutno uređivani checkpoint
  }

  // Funkcija koja ažurira koordinate u formi na osnovu emitovanih podataka
  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    this.checkpointForm.patchValue({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    });
  }
}
