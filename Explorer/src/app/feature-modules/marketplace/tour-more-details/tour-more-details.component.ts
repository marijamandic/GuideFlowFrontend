import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Level, Tour } from '../../tour-authoring/model/tour.model';
import { Checkpoint } from '../../tour-authoring/model/tourCheckpoint.model';
import { TourReview } from '../../tour-authoring/model/tourReview';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { environment } from 'src/env/environment';
import { Currency, Price } from '../../tour-authoring/model/price.model';

@Component({
  selector: 'xp-tour-more-details',
  templateUrl: './tour-more-details.component.html',
  styleUrls: ['./tour-more-details.component.css']
})
export class TourMoreDetailsComponent implements OnInit{
  user : User
  tourId : number | null;
  tour: Tour;
  checkpoints:Checkpoint[];
  reviews:TourReview[];
  checkpointCoordinates: { latitude: number, longitude: number }[] = [];
  @Input() forUpdating : boolean;
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  MapViewMode:boolean = false;
  
  constructor(private authService: AuthService,private route: ActivatedRoute,private tourService:TourService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTour();
  }

  loadTour():void {
    if(this.tourId != null){
      this.tourService.getTourById(this.tourId).subscribe({
        next: (result) => {
          this.tour = result; 
          this.checkpoints = this.tour.checkpoints;
          this.reviews = this.tour.reviews;
          this.reviews = this.tour.reviews.map((review) => ({
            ...review,
            creationDate: review.creationDate 
              ? (review.creationDate instanceof Date ? review.creationDate : new Date(review.creationDate))
              : new Date(), // Fallback to current date if undefined
          }));
          this.tour.averageGrade = 4;
          this.checkpointCoordinates = this.checkpoints.map(cp => ({ latitude: cp.latitude, longitude: cp.longitude }));
          this.checkpointsLoaded.emit(this.checkpointCoordinates);
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
      });
    }
  }

  getImagePath(imageUrl: string | undefined){
    if(imageUrl!==undefined){
      return environment.webRootHost+imageUrl;
    }
    return "";
  }

  getLevel(level: Level): string {
    switch (level) {
      case Level.Easy:
        return 'Easy';
      case Level.Advanced:
        return 'Advanced';
      case Level.Expert:
        return 'Expert';
      default:
        return 'Unknown';
    }
  }
  
  getFormattedPrice(price: Price): string {
    if (!price) return '';
    switch (price.currency) {
      case Currency.RSD:
        return `${price.cost} RSD`;
      case Currency.EUR:
        return `${price.cost} €`;
      case Currency.USD:
        return `${price.cost} $`;
      default:
        return `${price.cost}`;
    }
  }
  
  getStars(): string[] {
    if (!this.tour || !this.tour.averageGrade) return [];
  
    const fullStars = Math.floor(this.tour.averageGrade); // Broj punih zvezdica
    const hasHalfStar = this.tour.averageGrade % 1 >= 0.5; // Provera za pola zvezde
    const totalStars = fullStars + (hasHalfStar ? 1 : 0); // Ukupan broj zvezdica
  
    // Prikazivanje zvezdica
    const stars = Array(5).fill('empty'); // Postavljamo sve zvezdice na prazne
    stars.fill('full', 0, fullStars); // Dodajemo pune zvezde
    if (hasHalfStar && fullStars < 5) {
      stars[fullStars] = 'half'; // Dodajemo pola zvezde
    }
  
    return stars;
  }
  
  getStarsFromRating(rating: number | undefined): string[] {
    if (!rating) return [];
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
  
    return [
      ...Array(fullStars).fill('full'),
      ...(hasHalfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty'),
    ];
  }
  
  
}
