import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component'; // Prilagodite put do vašeg MapComponent
import { TourService } from '../tour.service';

@Component({
  selector: 'xp-positionsim',
  templateUrl: './positionsim.component.html',
  styleUrls: ['./positionsim.component.css']
})
export class PositionsimComponent implements OnInit {
  latitude: number | null = null;  // Koordinate
  longitude: number | null = null; // Koordinate
  private marker: { latitude: number; longitude: number } | null = null; // Trenutni marker
  private previousCoordinates: { latitude: number; longitude: number } | null = null; // Čuvanje prethodnih koordinata

  @ViewChild(MapComponent) mapComponent!: MapComponent; // Referenca na MapComponent

  constructor(private tourService: TourService) {}

  ngOnInit(): void {}

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    // Proveravamo da li se koordinate razlikuju od prethodnih
    if (!this.previousCoordinates || 
        this.previousCoordinates.latitude !== coordinates.latitude || 
        this.previousCoordinates.longitude !== coordinates.longitude) {
      
      // Uvek resetuj mapu pre dodavanja novog markera
      this.mapComponent.resetMap(); // Uklanjanje prethodnog markera na mapi

      // Postavi nove koordinate
      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude; 

      // Postavi novi marker
      this.marker = { latitude: this.latitude, longitude: this.longitude }; 
      this.previousCoordinates = { latitude: this.latitude, longitude: this.longitude }; // Ažuriraj prethodne koordinate
    }
  }
  saveCoordinates(): void {
    if (this.latitude !== null && this.longitude !== null) {
      console.log('Saving Coordinates:', this.latitude, this.longitude);
  
      const userId = 1; // Ovo bi trebalo biti dinamično postavljeno na osnovu trenutnog korisnika
  
      // Prvo, dobijamo turiste po ID-u
      this.tourService.getTouristById(userId).subscribe(user => {
        // Ako dobijemo korisnika, ažuriramo njegove koordinate
        if (user) {
          // Ažuriraj longitude i latitude
          user.location.longitude = this.longitude!;
          user.location.latitude = this.latitude!;
  
          // Zatim pozivamo updateTourist da pošaljemo izmenjenog korisnika
          this.tourService.updateTourist(user).subscribe(updatedUser => {
            console.log('Updated User:', updatedUser);
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
  
  //******da bih mogao da kreiram commit posto sam greskom prvo pushovao na development */
  promenljiva = 1;
}
