import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component'; // Prilagodite put do vašeg MapComponent
import { TourService } from '../tour.service';
import { Tourist } from '../model/tourist';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-positionsim',
  templateUrl: './positionsim.component.html',
  styleUrls: ['./positionsim.component.css']
})
export class PositionsimComponent implements OnInit {
  latitude: number | null = null;  
  longitude: number | null = null; 
  private marker: { latitude: number; longitude: number } | null = null; 
  private previousCoordinates: { latitude: number; longitude: number } | null = null; 

  @ViewChild(MapComponent) mapComponent!: MapComponent; 

  constructor(private tourService: TourService, private authService : AuthService) {}
  user : User;


  ngOnInit(): void {}

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    if (!this.previousCoordinates || 
        this.previousCoordinates.latitude !== coordinates.latitude || 
        this.previousCoordinates.longitude !== coordinates.longitude) {
      
      this.mapComponent.resetMap();

      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude; 

      this.marker = { latitude: this.latitude, longitude: this.longitude }; 
      this.previousCoordinates = { latitude: this.latitude, longitude: this.longitude }; 
    }
  }
  saveCoordinates(): void {
    if (this.latitude !== null && this.longitude !== null) {
      console.log('Saving Coordinates:', this.latitude, this.longitude);
  
      this.authService.user$.subscribe(user =>{
        this.user = user;
      })

      this.tourService.getTouristById(this.user.id).subscribe(tourist => {

        if (tourist) {

          tourist.location.longitude = this.longitude!;
          tourist.location.latitude = this.latitude!;
  

          this.tourService.updateTourist(tourist).subscribe(updatedTourist => {
            console.log('Updated User:', updatedTourist);
          }, error => {
            console.error('Error updating user:', error);
          });
        }
      }, error => {
        console.error('Error fetching user:', error);
      });
      
    } else {
      console.error('No coordinates selected to save.');
    }
  }
  
}
