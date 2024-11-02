import { Component, EventEmitter, Input, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Currency, Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';


export enum TourStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived'
}

export enum Level {
  Easy = 'Easy',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnChanges {
  
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour ;
  @Input() shouldEdit: boolean = false;

  tags: string[] = [''];

  constructor(private service: TourService) {
  }
  
  ngOnChanges(): void {
    //his.initializeTour();
    this.tags = ['']; // Resetuj tagove pri promeni
    if (this.shouldEdit) {
      this.tags = this.tour.taggs || ['']; // Učitaj postojeće tagove
    }
  }

  initializeTour(): Tour {
    return {
      id: 0,
      name: '',
      description: '',
      price: { cost: 0, currency:0 },
      level: 0,
      status: 0,
      lengthInKm: 0,
      averageGrade: 0.0,
      taggs: [],
      checkpoints: [],
      transportDurations: [],
      reviews: []
    };
  }

  addTag(): void {
    this.tags.push(''); // Dodaj novo prazno polje za tag
  }

  addTour(): void {
    const curr = this.ConvertCurrency();
    const level = this.ConvertLevel();
    const status = this.ConvertStatus();

    const newTour: Tour = {
      name: this.tour.name || "",
      description: this.tour.description || "",
      id: 0,
      price: {
        cost: this.tour.price.cost || 0,
       // currency: this.tour.price.currency || 0
       currency : curr
      },
      level: level || 0,
      status: status || 0,
      lengthInKm : 0,
      averageGrade: 0.0,
      taggs: this.tags.filter(tag => tag.trim() !== ''), // Filtriraj prazne tagove
      checkpoints: this.tour.checkpoints || [],
      transportDurations: this.tour.transportDurations || [],
      reviews: this.tour.reviews || [],
    };
    this.service.addTour(newTour).subscribe({
      next: () => { this.tourUpdated.emit(); }
    });

  }

  ConvertCurrency(): number {

    switch (this.tour.price.currency) {
      case  Currency.RSD :
        return 0;
      case Currency.EUR:
        return 1;
      case Currency.USD:
        return 2;
      default:
        return 0;
    }
  }

  
  ConvertLevel(): number {

    switch (this.tour.level) {
      case  0 :
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      default:
        return 0;
    }
  }

  
  ConvertStatus(): number {

    switch (this.tour.status) {
      case  0 :
        return 0;
      case 1:
        return 1;
      case 2:
        return 2;
      default:
        return 0;
    }
  }

  
    //this.tourForm.reset();
    /*if(this.shouldEdit) {
      this.tourForm.patchValue(this.tour);
    }  }
    tourForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(''),
      description: new FormControl(''),
      price: new FormGroup({
        cost: new FormControl(0),
        currency: new FormControl(Currency.EUR),
      }),
      level: new FormControl(Level.Easy),
      status: new FormControl(TourStatus.Draft),
      lengthInKm: new FormControl(0),
      averageGrade: new FormControl(0),
      tags: new FormControl(''),
      checkpoints: new FormControl([]), // Ako je to lista
      transportDurations: new FormControl([]), // Ako je to lista
      reviews: new FormControl([]), // Ako je to lista
    });
    
      

    addTour(): void {
      const tour: Tour = {
        name: this.tourForm.value.name || "",
        description: this.tourForm.value.description || "",
        id: 0,
        price: {
          cost: this.tourForm.value.price.cost || 0,
          currency: this.tourForm.value.price.currency || Currency.EUR // Postavite podrazumevanu vrednost
        },
        level: this.tourForm.value.level || Level.Easy,
        status: this.tourForm.value.status || TourStatus.Draft,
        tags: this.tourForm.value.tags.split(',').map(tag => tag.trim()),
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
        price: {
          cost: this.tourForm.value.price.cost || 0,
          currency: this.tourForm.value.price.currency || Currency.EUR // Postavite podrazumevanu vrednost
        },
        level: this.tourForm.value.level || Level.Easy,
        status: this.tourForm.value.status || TourStatus.Draft,
        tags: this.tourForm.value.tags.split(',').map(tag => tag.trim()),
      };
      tour.id = this.tour.id;
      this.service.updateTour(tour).subscribe({
        next: () => { this.tourUpdated.emit();}
      });*/
    
    


}
