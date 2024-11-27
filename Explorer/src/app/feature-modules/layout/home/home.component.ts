import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../../marketplace/model/shoppingCart.model';
import { AlertService } from '../alert.service';
import { LayoutService } from '../layout.service';
import { Club } from '../../administration/model/club.model';
import { TourPreview } from '../model/TourPreview';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/images/tour3.jpg',
    'assets/images/tour6.jpg',
    'assets/images/tour8.jpg'  
  ]; 
  currentImageIndex: number = 0;
  isTransitioning = false;
  user: User | undefined;
  shoppingCart: ShoppingCart | undefined

  tours: TourPreview[] = [];
  clubs: Club[] = [];

  constructor(
    private authService: AuthService, 
    private layoutService: LayoutService, 
    private a: AlertService, 
    private router: Router) {}

  fallbackTours: TourPreview[] = [
    {
      id: 1,
      name: 'Fallback Tour 1',
      description: 'Explore breathtaking mountains and serene landscapes.',
      imageUrl: 'assets/images/tour1.jpg',
    },
    {
      id: 2,
      name: 'Fallback Tour 2',
      description: 'Discover hidden waterfalls and lush forests.',
      imageUrl: 'assets/images/tour2.jpg',
    },
    {
      id: 3,
      name: 'Fallback Tour 3',
      description: 'Immerse yourself in historical wonders and ancient ruins.',
      imageUrl: 'assets/images/tour3.jpg',
    },
    {
      id: 4,
      name: 'Fallback Tour 4',
      description: 'Walk along pristine beaches and turquoise waters.',
      imageUrl: 'assets/images/tour4.jpg',
    },
    {
      id: 5,
      name: 'Fallback Tour 5',
      description: 'Witness the dazzling northern lights in the Arctic.',
      imageUrl: 'assets/images/tour5.jpg',
    }
  ];

  fallbackClubs: Club[] = [
    {
      id: 1,
      name: 'Fallback Club 1',
      description: 'A cozy place for explorers to connect and share experiences.',
      imageUrl: 'assets/images/default.jpg',
      ownerId: 0,
      imageBase64: '',
      memberCount: 0
    },
    {
      id: 2,
      name: 'Fallback Club 2',
      description: 'Join a community of adventurers with a passion for travel.',
      imageUrl: 'assets/images/default.jpg',
      ownerId: 0,
      imageBase64: '',
      memberCount: 0
    },
    {
      id: 3,
      name: 'Fallback Club 3',
      description: 'Meet locals and travelers at this vibrant club.',
      imageUrl: 'assets/images/default.jpg',
      ownerId: 0,
      imageBase64: '',
      memberCount: 0
    },
    {
      id: 4,
      name: 'Fallback Club 4',
      description: 'A hub for outdoor enthusiasts and nature lovers.',
      imageUrl: 'assets/images/default.jpg',
      ownerId: 0,
      imageBase64: '',
      memberCount: 0
    },
    {
      id: 5,
      name: 'Fallback Club 5',
      description: 'Network with like-minded adventurers in a relaxing atmosphere.',
      imageUrl: 'assets/images/default.jpg',
      ownerId: 0,
      imageBase64: '',
      memberCount: 0
    }
  ];

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.startImageRotation();
    this.loadTours();
    this.loadClubs();
  }

  navigateToClub(clubId: number): void {
    this.router.navigate(['/club-info', clubId]);
}

  loadTours(): void {
    this.layoutService.getAllTourPreviews().subscribe({
        next: (result: TourPreview[]) => {
            this.tours = result.length ? result.slice(0, 5) : this.fallbackTours;
        },
        error: () => {
            this.tours = this.fallbackTours;
        }
    });
  }

  loadClubs(): void {
    this.layoutService.getTopClubs().subscribe({
      next: (result: Club[]) => {
        const clubsToDisplay = result.length >= 5 
          ? result.slice(0, 5) 
          : [...result, ...this.fallbackClubs.slice(0, 5 - result.length)]; 
  
        this.clubs = clubsToDisplay.map(club => ({
          ...club,
          imageUrl: this.layoutService.getImagePath(club.imageUrl), 
        }));
        console.log(clubsToDisplay);
      },
      error: () => this.clubs = this.fallbackClubs, 
    });
  }
  
  startImageRotation() {
    setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 7000);
  }
}
