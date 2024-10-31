import { Component, EventEmitter, Input, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnChanges {
  
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;


  constructor(private service: TourService) {
  }
  
  ngOnChanges(): void {
    this.tourForm.reset();
    if(this.shouldEdit) {
      this.tourForm.patchValue(this.tour);
    }  }

    tourForm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      level: new FormControl(0, [Validators.required]),
      status: new FormControl('', [Validators.required]),
      taggs: new FormControl([0], [Validators.required]),
    });

    addTour(): void {
      const tour: Tour = {
        name: this.tourForm.value.name || "",
        description: this.tourForm.value.description || "",
        id: 0,
        price: this.tourForm.value.price || 0,
        level: this.tourForm.value.level || 0,
        status: this.tourForm.value.status || '',
        taggs: this.tourForm.value.taggs || []
      };

      this.service.addTour(tour).subscribe({
        next: () => { this.tourUpdated.emit() }
      });
    }

    updateTour(): void {
      const tour: Tour = {
        name: this.tourForm.value.name || "",
        description: this.tourForm.value.description || "",
        id: this.tourForm.value.id || 0,
        price: this.tourForm.value.price || 0,
        level: this.tourForm.value.level || 0,
        status: this.tourForm.value.status || '',
        taggs: this.tourForm.value.taggs || []
      };
      tour.id = this.tour.id;
      this.service.updateTour(tour).subscribe({
        next: () => { this.tourUpdated.emit();}
      });
    }
}
