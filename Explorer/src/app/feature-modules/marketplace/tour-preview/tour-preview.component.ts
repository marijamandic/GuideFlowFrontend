import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Currency, Level, Tour, TourStatus, TransportType } from '../../tour-authoring/model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-preview',
  templateUrl: './tour-preview.component.html',
  styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent implements OnInit {

  tourId: number;
  currentTour: Tour;
  user: User;
  isPurchased: boolean = false;  // Početna vrednost je false, dok se ne utvrdi
  isArchived: boolean = false; 

  constructor(private route: ActivatedRoute, private tourService: TourService,
              private marketService: MarketplaceService, private authService: AuthService,
              private cdr: ChangeDetectorRef) {
    this.currentTour = {
      id: 0,
      authorId: 0,
      name: "",
      description: "",
      price: {
        cost: 0,
        currency: Currency.RSD
      },
      level: Level.Easy,
      status: TourStatus.Published,
      lengthInKm: 0,
      averageGrade: 0,
      taggs: [],
      checkpoints: [],
      reviews: [],
      transportDurations: []
    };
  }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Prvo preuzimamo korisnika
    this.authService.user$.subscribe({
      next: (user: User) => {
        this.user = user;

        // Pozivamo getToken da sačekamo da se stanje tokena učita pre nego što nastavimo
        this.getToken(this.user.id, this.tourId).then((isPurchased) => {
          this.isPurchased = isPurchased; // Postavljamo isPurchased na osnovu rezultata
          
          // Ručno pokrećemo detekciju promena
          this.cdr.detectChanges();  // Dodato za osvežavanje stranice

          this.getCurrentTour(); // Pozivamo getCurrentTour nakon što je isPurchased postavljen
        }).catch(() => {
          this.isPurchased = false; // Ako dođe do greške, postavimo isPurchased na false
          
          // Ručno pokrećemo detekciju promena
          this.cdr.detectChanges();  // Dodato za osvežavanje stranice

          this.getCurrentTour(); // Pozivamo getCurrentTour čak i u slučaju greške
        });
      }
    });
  }

  getCurrentTour(): void {
    this.tourService.getTourById(this.tourId).subscribe({
      next: (result: Tour) => {
        this.currentTour = result;
        alert('prvo je getCurrentTour');
        alert(this.isPurchased);       
        this.isArchived = this.currentTour.status === TourStatus.Archived;
      }
    });
  }

  getToken(userId: number, tourId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.marketService.checkToken(userId, tourId).subscribe({
        next: (tour) => {
          if (tour !== null) {
            resolve(true); // Ako postoji token
          } else {
            resolve(false); // Ako ne postoji token
          }
        },
        error: () => {
          reject(false); // U slučaju greške
        }
      });
    });
  }

  addToCart(): void {
    alert('Added To Cart');
  }

  activateTour(): void {
    alert('Tour Activated');
  }
}
