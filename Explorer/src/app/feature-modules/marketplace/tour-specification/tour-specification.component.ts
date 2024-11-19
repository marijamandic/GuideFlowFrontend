import { Component, OnInit } from '@angular/core';
import { Level, TourSpecification } from '../model/tour-specification.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TransportRatings, TransportMode } from '../model/transportRating.model';

@Component({
  selector: 'xp-tour-specification',
  templateUrl: './tour-specification.component.html',
  styleUrls: ['./tour-specification.component.css']
})

export class TourSpecificationComponent implements OnInit {
  
 tourSpecification: TourSpecification[] = [];
 selectedTourSpecification: TourSpecification;
 shouldEdit: boolean;
 shouldRenderEquipmentForm: boolean = false;
 public userId: number;
 public TransportMode = TransportMode;
 ts = {
  userId: 0,
  level: Level.Easy,
  taggs: [''],
  transportRatings: [
    { rating: 0, transportMode: TransportMode.Walk },
    { rating: 0, transportMode: TransportMode.Bike },
    { rating: 0, transportMode: TransportMode.Car },
    { rating: 0, transportMode: TransportMode.Boat }
  ]
  };
 levels = Level;
 isEditing: boolean[] = []; // Ovo prati da li je forma za editovanje aktivna za svaki element
 isAddFormVisible = false;
 
  constructor(private service : MarketplaceService, private authService: AuthService) {
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id;
    })
  }

  ngOnInit(): void {
    this.getTourSpecification();
  }

  getTourSpecification(): void {
    this.service.getTourSpecification(this.userId).subscribe({
      next: (result: TourSpecification) => {
        console.log("API response:", result);
        this.tourSpecification = [result];
        console.log('Tour Specification assigned:', this.tourSpecification);
      },
      error: (err: any) => {
        console.error("Error fetching tour specification:", err);
      }
    });
  }

  getRatingByTransportMode(ratings: any[], mode: number): number {
    const rating = ratings.find(r => r.transportMode === mode);
    return rating ? rating.rating : 'No rating';
  }
  
  onEditClicked(tourSpecification: TourSpecification) : void{
    this.selectedTourSpecification = tourSpecification;
    this.shouldEdit = true;
    this.shouldRenderEquipmentForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderEquipmentForm = true;
  }

  deleteTourSpecification(tourSpecification: TourSpecification) : void {
    this.service.deleteTourSpecification(tourSpecification).subscribe({
      next: (_) => {
        //this.getTourSpecification(this.userId)
        this.tourSpecification = this.tourSpecification.filter(ts => ts.id !== tourSpecification.id);
      }
    })
  }

  toggleAddForm(ts: any) {
    if (ts) {
      ts.isAddFormVisible = !ts.isAddFormVisible;
    } else {
      this.isAddFormVisible = !this.isAddFormVisible;
    }
  }

  // toggleAddForm(ts: any) {
  //   if (ts) {
  //     this.ts = { ...ts };
  //     this.isAddFormVisible = true;
  //   } else {
  //     this.ts = {
  //       userId: this.userId,
  //       level: 0,
  //       taggs: [''],
  //       transportRatings: [
  //         { rating: 0 , transportMode: 0},
  //         { rating: 0 , transportMode: 1 },
  //         { rating: 0 , transportMode: 2 },
  //         { rating: 0 , transportMode: 3 }
  //       ]
  //     };
  //     this.isAddFormVisible = true;
  //   }
  // }
  

  addTag(ts: any) {
    ts.taggs.push('');
  }

  createTourSpecification(): void {
    this.ts.userId = this.userId;
    const level = this.ConvertLevel();
  
    this.ts.level = level | 0;
    this.service.addTourSpecification(this.ts).subscribe({
      next: (response) => {
        console.log('TourSpecification successfully created:', response);
        this.tourSpecification.push(response);
        this.isAddFormVisible = false;
      },
      error: (err) => {
        console.log('TourSpecification not created:', this.ts);

        console.error('Error creating TourSpecification:', err);
      }
    });
  }
  
  ConvertLevel(): number {
     
    switch (this.ts.level.toString()) {
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

  trackByIndex(index: number, item: any): number {
    return index;
  }
}