import { Component, OnInit } from '@angular/core';
import { Tour, Level, TourStatus } from '../model/tour.model';
import { Currency } from '../model/price.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  
  tour: Tour[] = [];
  selectedTour: Tour = this.initializeTour();
  shouldRenderTourForm: boolean = false;
  shouldOpenDetails:boolean = false;
  shouldEdit: boolean = false; 
  currentView: string;
  user:User;
  initialMarkers: L.LatLng[] = [];
  latitude: number | null = null;
  longitude: number | null = null;
  searchDistance: number | null = null;

  constructor(private service: TourService,private router:Router, private authService: AuthService){}
  
  tours: Tour[] = [];
  draftTours: Tour[]=[];
  publishedTours: Tour[]=[];
  archivedTours: Tour[]=[];

  ngOnInit(): void {
      this.getTours();  
      this.authService.user$.subscribe(user => {
        this.user=user;
        if(user.role==="tourist"){
          this.currentView="published";
        }else{
          this.currentView="drafts";
        }
      });
  }

  initializeTour(): Tour {
    return {
      id: 0,
      authorId:-1,
      name: '',
      description: '',
      price: 0,
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
    this.shouldRenderTourForm = false;
    this.shouldEdit = false;
    this.service.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.getDraftTours();
        this.getPublishedTours();
        this.getArchivedTours();
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
  getArchivedTours():void{
    this.archivedTours = this.tours.filter(t => t.status === TourStatus.Archived)
  }

  onTourClick(tour: any) {
    if(this.user.role ==='author'){
      this.router.navigate(['/tourDetails', tour.id]); // Navigacija na TourDetailComponent sa id-jem ture
    }
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
          this.publishedTours = tours;
        },
        error: (err: any) => {
          console.error('Error fetching search results:', err);
        }
      });
    } else {
      console.log('Please select a point on the map and enter a search distance.');
    }
  }
   
  onPublish(event: MouseEvent,tour:Tour): void {
    event.stopPropagation();
    if(tour.id !== null && tour.id !== undefined){
      console.log(tour.id);
      this.service.changeStatus(tour.id,"Publish").subscribe({
        next: () => {
          console.log("promenjeno");
          this.getTours();
        },
        error: (err: any)=>{
          if(err.status===400){
            alert("You can't publish this tour!");
          }
          console.log(err)
        }
      })
    }
  }
  
  archiveTour(event: MouseEvent,tour:Tour):void{
    event.stopPropagation();
    if(tour.id !== null && tour.id !== undefined){
      this.service.changeStatus(tour.id,"Archive").subscribe({
        next: () => {
          this.getTours();
        },
        error: (err: any)=>{
          console.log(err)
        }
      })
    }
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

  

