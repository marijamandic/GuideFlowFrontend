import { Component, EventEmitter, Input, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Tour } from '../model/tour.model';
import { Currency } from '../model/price.model';
import { TourService } from '../tour.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


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
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;
  @Output() closeModal = new EventEmitter<void>(); // Emiter za zatvaranje modala
  @Output() tourUpdated = new EventEmitter<void>(); // Emiter za obaveštavanje glavne komponente o promeni


  
  userId:number=-1;
  tags: string[] = [''];

  constructor(private service: TourService,private router:Router,private authService:AuthService) {
  }
  
  ngOnChanges(): void {
    //his.initializeTour();
    this.tags = ['']; // Resetuj tagove pri promeni
    if (this.shouldEdit) {
      this.tags = this.tour.taggs || ['']; // Učitaj postojeće tagove
    }
    this.authService.user$.subscribe(user => {
      if(user){
      this.userId = user.id;
      }
    });
  }

  initializeTour(): Tour {
    return {
      id: 0,
      authorId:-1,
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

  close(): void {
    this.closeModal.emit(); // Emituj događaj za zatvaranje
  }

  addTag(): void {
    this.tags.push(''); // Dodaj novo prazno polje za tag
  }

  addTour(): void {
    console.log('add metoda')

    const curr = this.ConvertCurrency();
    const level = this.ConvertLevel();
    const status = this.ConvertStatus();

    const newTour: Tour = {
      name: this.tour.name || "",
      description: this.tour.description || "",
      id: 0,
      authorId:this.userId,
      price: {
        cost: this.tour.price.cost || 0,
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
      next: (result:Tour) => {
        //this.router.navigate(['/checkpoints', result.id]);
        console.log('dodata nova tura', newTour);
      }
    });
    this.close();
  }

    updateTour(): void {
      const curr = this.ConvertCurrency();
      const level = this.ConvertLevel();
      const status = this.ConvertStatus();
      console.log('update metoda')
      const tour: Tour = {
        name: this.tour.name || "",
        description: this.tour.description || "",
        id: 0,
        authorId:this.userId,
        price: {
          cost: this.tour.price.cost || 0,
          currency : curr
        },
        level: level || 0,
        status: status || 0,
        lengthInKm : this.tour.lengthInKm || 0,
        averageGrade: this.tour.averageGrade || 0,
        taggs: this.tags.filter(tag => tag.trim() !== ''), // Filtriraj prazne tagove
        checkpoints: this.tour.checkpoints || [],
        transportDurations: this.tour.transportDurations || [],
        reviews: this.tour.reviews || [],
        }

        tour.id = this.tour.id;
        this.service.updateTour(tour).subscribe({
          next: () => { this.tourUpdated.emit();}
        });
        this.close();
      }

      ConvertCurrency(): number {
        console.log('Currency je ',this.tour.price.currency)
         switch (this.tour.price.currency.toString()) {
           case  "RSD" :
             return 0;
           case "EUR":
             return 1;
           case "USD":
             return 2;
           default:
             return 0;
         }
       }
     
       
       ConvertLevel(): number {
     
         switch (this.tour.level.toString()) {
           case  "Easy" :
             return 0;
           case "Advanced":
             return 1;
           case "Expert":
             return 2;
           default:
             return 0;
         }
       }
     
       
       ConvertStatus(): number {
     
         switch (this.tour.status.toString()) {
           case  "Draft" :
             return 0;
           case "Published":
             return 1;
           case "Archived":
             return 2;
           default:
             return 0; 
         }
       }
}
