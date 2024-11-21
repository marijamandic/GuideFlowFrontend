import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourStatus } from '../../tour-authoring/model/tour.model';
import { TransportMode } from '../model/transportRating.model';
import { Level, TourSpecification } from '../model/tour-specification.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent implements OnInit {

  allTours: Tour[] = [];

 tourSpecification: TourSpecification[] = [];
  public TransportMode = TransportMode;
 public userId: number;
  ts = {
   id: 0,
   userId: 0,
   level: Level.Easy,
   taggs: [] as string[],
   transportRatings: [
     { rating: 0, transportMode: TransportMode.Walk },
     { rating: 0, transportMode: TransportMode.Bike },
     { rating: 0, transportMode: TransportMode.Car },
     { rating: 0, transportMode: TransportMode.Boat }
   ]
   };
  levels = Level;
  tagsInputValue: string = '';
  currentTourSpecId: number | undefined;

  constructor(private service: TourExecutionService, authService: AuthService, private cdr: ChangeDetectorRef) {
    authService.user$.subscribe((user: User) => {
      this.userId = user.id;
    })
   }

  ngOnInit(): void {
    this.getTourSpecificationPromise();  
    this.service.getAllTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.allTours = result.results.filter(tour => tour.status === TourStatus.Published);
        console.log(this.allTours[1].reviews); 
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  calculateAverageRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }

  getFilteredTours(tourSpecification : TourSpecification): Tour[] {
    return this.allTours.filter(tour => {
      const matchesTags = tourSpecification.taggs.some(tag => tour.taggs.includes(tag));
      const matchesLevel = tour.level === tourSpecification.level;
      return matchesTags || matchesLevel;
    });
  }
  
  onFilterClicked(): void {
    this.createTourSpecification().then(() => {
      if (this.tourSpecification && this.tourSpecification.length > 0) {
        const userSpec = this.tourSpecification[0];
        this.allTours = this.getFilteredTours(userSpec);
        console.log("Filtered Tours:", this.allTours);
      }
    }).catch((err) => {
      console.error('Error creating tour specification:', err);
    });
  }

  async deleteTourSpecification(): Promise<void> {
    if (!this.currentTourSpecId) {
      console.error("Invalid tourSpecification id, cannot delete.");
      return;
    }
  
    console.log("Deleting tourSpecification with id:", this.currentTourSpecId);
  
    this.service.deleteTourSpecification({ id: this.currentTourSpecId } as TourSpecification).subscribe({
      next: (_) => {
        console.log('Tour specification successfully deleted');
        this.tourSpecification = this.tourSpecification.filter(ts => ts.id !== this.currentTourSpecId);
        this.resetForm();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error deleting tour specification:', err);
      }
    });
  }
  

  getTourSpecificationPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.service.getTourSpecification(this.userId).subscribe({
        next: (result: TourSpecification) => {
          console.log("API response:", result);
          this.tourSpecification = [result];
          this.ts = {
            id: result.id ?? 0,
            userId: result.userId,
            level: result.level,
            taggs: result.taggs,
            transportRatings: result.transportRatings
          };
          this.currentTourSpecId = result.id;
          console.log('Tour Specification assigned:', this.tourSpecification);
  
          this.tagsInputValue = this.ts.taggs.join(', ');
          resolve();
        },
        error: (err: any) => {
          console.error("Error fetching tour specification:", err);
          reject(err);
        }
      });
    });
  }
  

  getRatingByTransportMode(ratings: any[], mode: number): number {
    const rating = ratings.find(r => r.transportMode === mode);
    return rating ? rating.rating : 'No rating';
  }

  createTourSpecification(): Promise<void> {
    this.ts.userId = this.userId;
    const tagsArray = this.tagsInputValue.split(',').map(tag => tag.trim());
    this.ts.taggs = tagsArray;
  
    return new Promise((resolve, reject) => {
      this.service.addTourSpecification(this.ts).subscribe({
        next: (response: TourSpecification) => {
          console.log('TourSpecification successfully created:', response);
          this.tourSpecification.push(response);
          this.currentTourSpecId = response.id;
          resolve();
        },
        error: (err) => {
          console.error('Error creating TourSpecification:', err);
          reject(err);
        }
      });
    });
  }
  
  

  trackByIndex(index: number, item: any): number {
    return index;
  }

  resetForm(): void {
    this.ts = {
      id: 0,
      userId: this.userId,
      level: Level.Easy,
      taggs: [],
      transportRatings: [
        { rating: 0, transportMode: TransportMode.Walk },
        { rating: 0, transportMode: TransportMode.Bike },
        { rating: 0, transportMode: TransportMode.Car },
        { rating: 0, transportMode: TransportMode.Boat }
      ]
    };
  
    this.tagsInputValue = '';
  }
 
  isFormEmpty(): boolean {
    return !this.ts.taggs.length || 
           this.ts.level === Level.Easy;
  }

  async filterTours(): Promise<void> {
    const userSpec = this.tourSpecification[0];
    this.allTours = await this.getFilteredTours(userSpec);
    this.cdr.detectChanges();
  }

  async applyChanges(): Promise<void> {
    try {
      if (this.currentTourSpecId) {
        await this.deleteTourSpecification();
      }
      await this.createTourSpecification();
      await this.getTourSpecificationPromise();
      this.allTours = this.getFilteredTours(this.tourSpecification[0]);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error applying changes:', error);
    }
  }
}