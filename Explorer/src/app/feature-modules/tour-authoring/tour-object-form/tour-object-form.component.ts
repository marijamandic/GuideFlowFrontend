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

  @Output() tourObjectUpdated = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService) {}

  categories = [
    { value: 0, label: 'Parking' },
    { value: 1, label: 'Restaurant' },
    { value: 2, label: 'Toilet' },
    { value: 3, label: 'Other' }
  ];

  tourObjectForm = new FormGroup ({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    category: new FormControl(null, [Validators.required])
  })

  addTourObject(): void {
    if (this.tourObjectForm.invalid) {
      return;
    }

    const tourObject: TourObject = {
      name: this.tourObjectForm.value.name || "",
      description: this.tourObjectForm.value.description || "",
      imageUrl: this.tourObjectForm.value.imageUrl || "",
      category: Number(this.tourObjectForm.value.category)
    }

    this.service.addTourObject(tourObject).subscribe({
      next: (_) => {
        this.tourObjectUpdated.emit();
      }
    });
  }
}
