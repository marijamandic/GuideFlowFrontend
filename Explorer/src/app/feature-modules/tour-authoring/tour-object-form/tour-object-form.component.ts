import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { TourObject } from '../model/tourObject.model';

@Component({
  selector: 'xp-tour-object-form',
  templateUrl: './tour-object-form.component.html',
  styleUrls: ['./tour-object-form.component.css']
})
export class TourObjectFormComponent {
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() tourObjectUpdated = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;
  imageBase64: string;
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;
  @Input() name: string;
  @Input() description: string;
  @Input() imageUrl: string;
  @Input() category: number;
  @Input() id: number = 0;
  isEditing: boolean = true;

  constructor(private service: TourAuthoringService) {}

  categories = [
    { value: 0, label: 'Parking' },
    { value: 1, label: 'Restaurant' },
    { value: 2, label: 'Toilet' },
    { value: 3, label: 'Other' }
  ];

  ngOnChanges() {
    console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);
    console.log('ID:', this.id);
    if (this.latitude !== null && this.longitude !== null) {
      this.isEditing = true;
      this.tourObjectForm.patchValue({
          latitude: this.latitude,
          longitude: this.longitude,
          name: this.name,
          description: this.description,
          imageUrl: this.imageUrl,
          category: this.category
      }); 
      
  }
  }

  tourObjectForm = new FormGroup ({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl(''),
    imageBase64: new FormControl(''),
    category: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required])
  });

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    this.tourObjectForm.patchValue({
      latitude: this.latitude,
        longitude: this.longitude,
        name: this.name,
        description: this.description,
        imageUrl: this.imageUrl,
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.tourObjectForm.patchValue({
        imageBase64: this.imageBase64
      });
    };
    reader.readAsDataURL(file);
  }

  addTourObject(): void {
    if (this.tourObjectForm.invalid) {
      return;
    }

    const tourObject: TourObject = {
      name: this.tourObjectForm.value.name || "",
      description: this.tourObjectForm.value.description || "",
      imageUrl: this.tourObjectForm.value.imageUrl || "",
      imageBase64: this.tourObjectForm.value.imageBase64 || "",
      category: Number(this.tourObjectForm.value.category),
      latitude: this.tourObjectForm.value.latitude || 0,  // Ažuriranje latitude
      longitude: this.tourObjectForm.value.longitude || 0 // Ažuriranje longitude
    };
    console.log(tourObject)
    if (this.isEditing) {
      this.service.addTourObject(tourObject).subscribe({
        next: (_) => {
          this.tourObjectUpdated.emit();
          console.log('Tour object successfully added');
        }
      });
    } else {
      this.service.updateTourObject(tourObject, this.id).subscribe({
        next: (_) => {
          this.tourObjectUpdated.emit();
          console.log('Tour object successfully updated');
        }
      });
    }
    
  }
}
