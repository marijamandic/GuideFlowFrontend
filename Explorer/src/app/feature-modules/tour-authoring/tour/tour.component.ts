import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  
  tour: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  initialMarkers: L.LatLng[] = [];
  latitude: number | null = null;
  longitude: number | null = null;
  searchDistance: number | null = null;

  constructor(private service: TourService){}
  
  tours: Tour[] = [];
  filteredTours: Tour[] = [];

  ngOnInit(): void {
      this.getTours();
  }

  getTours(): void{
    this.service.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
      },
      error: (err: any)=>{
        console.log(err)
      }
    })
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
    if (this.latitude !== null && this.longitude !== null && this.searchDistance) {
      this.service.searchTours(this.latitude, this.longitude, this.searchDistance).subscribe({
        next: (result: PagedResults<Tour>) => {
          this.filteredTours = result.results;
        },
        error: (err: any) => {
          console.log(this.latitude, this.longitude, this.searchDistance);
        }
      });
    }
  }

  onDistanceChange(): void {
    this.searchTours();
  }
}
