import { Component, OnInit } from '@angular/core';
import { Currency, Level, Tour, TourStatus } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  
  tour: Tour[] = [];
  selectedTour: Tour = this.initializeTour();
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  initialMarkers: L.LatLng[] = [];
  latitude: number | null = null;
  longitude: number | null = null;
  searchDistance: number | null = null;
  user: User | undefined;
  forPublish: boolean = false;

  constructor(private service: TourService, private authService: AuthService){}
  
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  draftTours: Tour[]=[];
  publishedTours: Tour[]=[];

  ngOnInit(): void {
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
      this.getTours();
  }

  initializeTour(): Tour {
    return {
      id: 0,
      authorId:-1,
      name: '',
      description: '',
      price: { cost: 0, currency: Currency.EUR },
      level: Level.Easy,
      status: TourStatus.Draft,
      lengthInKm: 0,
      averageGrade: 0.0,
      taggs: [],
      checkpoints: [],
      transportDurations: [],
      reviews: []
    };
  }


  getTours(): void{
    this.service.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.getDraftTours();
        this.getPublishedTours();
      },
      error: (err: any)=>{
        console.log(err)
      }
    })
   
  }

  getDraftTours():void{
    
    this.draftTours = this.tours.filter(t=> t.status === TourStatus.Draft);
  }
  getPublishedTours():void{
    this.publishedTours = this.tours.filter(t => t.status === TourStatus.Published)
  }

  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTours();
      },
    })
  }
  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.selectedTour = this.initializeTour();
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    console.log('Coordinates selected:', coordinates);
    this.latitude = coordinates.latitude;
    this.longitude = coordinates.longitude;
    this.searchTours();
  }
  onMarkerAdded(latlng: L.LatLng): void {
    console.log('New marker added at:', latlng);
  }
  onMapReset(): void {
    console.log('Map reset');
  }

  searchTours(): void {
    if (this.latitude !== null && this.longitude !== null && this.searchDistance !== null) {
      this.service.searchTours(this.latitude, this.longitude, this.searchDistance).subscribe({
        next: (tours: Tour[]) => {
          this.filteredTours = tours;

        },
        error: (err: any) => {
          console.error('Error fetching search results:', err);
        }
      });
    } else {
      console.log('Please select a point on the map and enter a search distance.');
    }
  }
   
  onPublish(tour:Tour): void {
    this.selectedTour = tour;
    this.shouldEdit = true;
    this.forPublish = true;
    this.shouldRenderTourForm = true;
  }

  CurrencyMap = {
    0: 'RSD',
    1: 'EUR',
    2: 'USD'
};

LevelMap = {
    0: 'Easy',
    1: 'Advanced',
    2: 'Expert'
};
StatusMap = {
  0: 'Draft',
  1: 'Published',
  2: 'Archived'
}
}

  

