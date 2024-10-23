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
  imageBase64: string;

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
    imageUrl: new FormControl(''),
    imageBase64: new FormControl(''),
    category: new FormControl(null, [Validators.required])
  })

  onFileSelected(event : any){
    const file : File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () =>{
      this.imageBase64 = reader.result as string;
      this.tourObjectForm.patchValue({
        imageBase64: this.imageBase64
      });
    }
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
  }

  this.service.addTourObject(tourObject).subscribe({
    next: (_) => {
      this.tourObjectUpdated.emit();
      console.log('Tour object successfully added');
    }
  });
  }
}
