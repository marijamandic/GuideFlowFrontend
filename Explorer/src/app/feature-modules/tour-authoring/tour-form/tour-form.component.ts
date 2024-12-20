import { Component, EventEmitter, Input, Inject, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Tour } from '../model/tour.model';
import { Currency } from '../model/price.model';
import { TourService } from '../tour.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { WeatherCondition, WeatherConditionType } from '../model/weatherCondition.model';


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

  weatherRequirements: WeatherCondition = {
    minTemperature: 0,
    maxTemperature: 0,
    suitableConditions: []
  };
  weatherConditionTypes: string[] = ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'];

  userId:number=-1;
  tags: string[] = [''];

  constructor(private service: TourService,private router:Router,private authService:AuthService) {
  }
  
  ngOnChanges(): void {
    //his.initializeTour();
    this.tags = ['']; // Resetuj tagove pri promeni
    if (this.shouldEdit) {
      this.tags = this.tour.taggs || ['']; // Učitaj postojeće tagove
      this.weatherRequirements = this.tour.weatherRequirements || {
        minTemperature: 0,
        maxTemperature: 0,
        suitableConditions: []
      };
    }else{
      this.weatherRequirements = {
        minTemperature: 0,
        maxTemperature: 0,
        suitableConditions: []
      };
    }
    this.authService.user$.subscribe(user => {
      if(user){
      this.userId = user.id;
      }
    });
  }

  trackByIndex(index: number, item: string): number {
    return index; 
  }

  initializeTour(): Tour {
    return {
      id: 0,
      authorId:-1,
      name: '',
      description: '',
      price: 0,
      level: 0,
      status: 0,
      lengthInKm: 0,
      averageGrade: 0.0,
      taggs: [],
      checkpoints: [],
      transportDurations: [],
      reviews: [],
      weatherRequirements: {
        minTemperature: 0,
        maxTemperature: 0,
        suitableConditions: []
      }
    };
  }

  close(): void {
    this.closeModal.emit(); // Emituj događaj za zatvaranje
  }

  addTag(): void {
    //this.tags.push(''); // Dodaj novo prazno polje za tag
    this.tags = ['', ...this.tags];
    console.log(this.tags);
  }

  private stringToEnum(condition: string): WeatherConditionType | undefined {
    switch (condition) {
      case 'Clear':
        return WeatherConditionType.CLEAR;
      case 'Clouds':
        return WeatherConditionType.CLOUDS;
      case 'Rain':
        return WeatherConditionType.RAIN;
      case 'Snow':
        return WeatherConditionType.SNOW;
      case 'Mist':
        return WeatherConditionType.MIST;
      default:
        return undefined; // Vraća undefined ako nije validan string
    }
  }

  toggleWeatherCondition(condition: string): void {
    console.log(condition);
    if (this.isConditionSelected(condition)) {
      this.removeWeatherCondition(condition);
    } else {
      this.addWeatherCondition(condition);
    }
  }

  isConditionSelected(condition: string): boolean {
    const conditionEnum = this.stringToEnum(condition);
    console.log(conditionEnum);
    return conditionEnum !== undefined && this.weatherRequirements.suitableConditions.includes(conditionEnum);
  }

  addWeatherCondition(condition: string): void {
    const conditionEnum = this.stringToEnum(condition);
    if (conditionEnum !== undefined) {
      this.weatherRequirements.suitableConditions.push(conditionEnum);
    }
    console.log(this.weatherRequirements.suitableConditions);
  }

  removeWeatherCondition(condition: string): void {
    const conditionEnum = this.stringToEnum(condition);
    if (conditionEnum !== undefined) {
      this.weatherRequirements.suitableConditions = this.weatherRequirements.suitableConditions.filter(c => c !== conditionEnum);
    }
  }

  addTour(): void {
    console.log('add metoda')
    const level = this.ConvertLevel();

    const newTour: Tour = {
      name: this.tour.name || "",
      description: this.tour.description || "",
      id: 0,
      authorId:this.userId,
      price: this.tour.price || 0,
      level: level || 0,
      status: 0,
      lengthInKm : 0,
      averageGrade: 0.0,
      taggs: this.tags.filter(tag => tag.trim() !== ''), // Filtriraj prazne tagove
      checkpoints: this.tour.checkpoints || [],
      transportDurations: this.tour.transportDurations || [],
      reviews: this.tour.reviews || [],
      weatherRequirements: this.weatherRequirements || { 
        minTemperature: 0, 
        maxTemperature: 0, 
        suitableConditions: [] 
      }
    };
    this.service.addTour(newTour).subscribe({
      next: (result:Tour) => {
        console.log('dodata nova tura', newTour);
        this.router.navigate(['/tourAuthorDetails', result.id]);
      },
      error: (err: any) => {
        console.log( 'nova tura', newTour)
        console.error('Error dodavanje tura:', err);
      }
    });
  }

    updateTour(): void {
      const level = this.ConvertLevel();
      console.log(status);
      console.log('update metoda')
      const tour: Tour = {
        name: this.tour.name || "",
        description: this.tour.description || "",
        id: 0,
        authorId:this.userId,
        price: this.tour.price || 0,
        level: level || 0,
        status: this.tour.status,
        lengthInKm : this.tour.lengthInKm,
        averageGrade: this.tour.averageGrade,
        taggs: this.tags.filter(tag => tag.trim() !== ''), // Filtriraj prazne tagove
        checkpoints: this.tour.checkpoints || [],
        transportDurations: this.tour.transportDurations || [],
        reviews: this.tour.reviews || [],
        weatherRequirements: this.weatherRequirements || { 
          minTemperature: 0, 
          maxTemperature: 0, 
          suitableConditions: [] 
        }
      }

        tour.id = this.tour.id;
        this.service.updateTour(tour).subscribe({
          next: () => { this.tourUpdated.emit();}
        });
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
}
