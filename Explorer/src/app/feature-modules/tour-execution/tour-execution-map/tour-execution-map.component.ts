import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/shared/map/map.service';
import 'leaflet-routing-machine';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { PublicPointService } from '../../tour-authoring/tour-public-point.service';

@Component({
  selector: 'xp-tour-execution-map',
  templateUrl: './tour-execution-map.component.html',
  styleUrls: ['./tour-execution-map.component.css'],
})
export class TourExecutionMap implements AfterViewInit,OnChanges {
  private map: any;
  private markers: L.Marker[] = [];
  private userMarker: L.Marker | null = null;  // Dodajemo referencu na korisnikov marker
  searchAddress: string = '';
  private routeControl: any = null;

  @Input() initialMarkers: L.LatLng[] = [];
  @Input() allowMultipleMarkers: boolean = true;
  @Input() checkpoints: { latitude: number; longitude: number }[] = [];
  @Input() showSearchBar: boolean = true;
  @Output() markerAdded = new EventEmitter<L.LatLng>();
  @Output() mapReset = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() distanceCalculated = new EventEmitter<{ transportType: string; time: number; distance: number }>();

  constructor(private mapService: MapService, private tourService: TourService, private authService : AuthService, private publicPointService: PublicPointService) {}
  user : User;

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    if (!this.map) {
      this.initMap(); 
    }
    this.loadPublicPoints();
  }

  private initMap(): void {
    if (this.map) {
      console.log('Mapa je već inicijalizovana');
      return; 
    }

    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.registerOnClick();

    this.initialMarkers.forEach((latLng) => {
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });

    this.checkpoints.forEach((checkpoint) => {
      const latLng = new L.LatLng(checkpoint.latitude, checkpoint.longitude);
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });
  }

  setRoute(waypoints: L.LatLng[]): void {
    console.log("RUTAL: ", this.checkpoints.length);
    if (waypoints.length > 1) {
      if (this.routeControl) {
        if (this.map.hasLayer(this.routeControl)) {
          this.map.removeControl(this.routeControl);
        }
        this.routeControl = null; 
      }
  
      this.routeControl = L.Routing.control({
        waypoints: waypoints,
        router: L.routing.mapbox(
          'pk.eyJ1IjoicmF0a292YWMiLCJhIjoiY20ybDJmdGNxMDdkMjJrc2dodncycWhhZiJ9.fkyW7QT3iz7fxVS5u5w1bg',
          { profile: 'mapbox/walking' }
        ),
        addWaypoints: false, 
      }).addTo(this.map);
  
      this.routeControl.on('routesfound', (e: { routes: any }) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const totalDistanceKm = (summary.totalDistance / 1000).toFixed(2);
        const totalTimeMinutes = Math.round(summary.totalTime / 60);
        alert(`Total distance is ${totalDistanceKm} km and total time is ${totalTimeMinutes} minutes for walking`);
        this.distanceCalculated.emit({
          transportType: 'walking',
          time: totalTimeMinutes,
          distance: parseFloat(totalDistanceKm),
        });
      });
    }
  }
  

  ngOnChanges(): void {
    if (this.map) {
      this.updateCheckpointMarkers();
    }
  }

  private updateCheckpointMarkers(): void {
    this.resetMap();

    this.checkpoints.forEach(checkpoint => {
      const latLng = new L.LatLng(checkpoint.latitude, checkpoint.longitude);
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });

    if (this.markers.length > 1) {
      const waypoints = this.markers.map(m => m.getLatLng());
      this.setRoute(waypoints);
    }
  }

  search(): void {

    this.mapService.search(this.searchAddress).subscribe({
      next: (result) => {
        const marker = L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz ' + result[0].display_name + '.')
          .openPopup();
          
        this.addMarker(marker);
      },
      error: () => {},
    });

  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      if (!this.showSearchBar) {
        return;
      }
  
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];
  
      const coord = e.latlng;
      this.latitude = coord.lat;
      this.longitude = coord.lng;
  
      const customIcon = L.icon({
        iconUrl: 'assets/images/pin.png', 
        iconSize: [41, 41],  
        iconAnchor: [15, 30], 
        popupAnchor: [0, -30], 
      });
  
      const marker = new L.Marker([coord.lat, coord.lng], { icon: customIcon }).addTo(this.map);
      this.markers.push(marker);
  
      this.coordinatesSelected.emit({ latitude: coord.lat, longitude: coord.lng });
    });
  }
  

  addMarker(marker: L.Marker): void {
    this.markers.push(marker);
    const latLng = marker.getLatLng();
    this.coordinatesSelected.emit({ latitude: latLng.lat, longitude: latLng.lng });
  }

  resetMap(): void {
    this.searchAddress="";

    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }

    this.mapReset.emit();
  }
  
  latitude: number | null = null;  
  longitude: number | null = null; 
  private marker: { latitude: number; longitude: number } | null = null; 
  private previousCoordinates: { latitude: number; longitude: number } | null = null; 



  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.tourService.getTouristById(this.user.id).subscribe(tourist => {
        if (tourist) {
          if(tourist) {
            this.addUserMarker(tourist);  
          }
        }
      });
    });
  }

  onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
    if (!this.previousCoordinates || 
        this.previousCoordinates.latitude !== coordinates.latitude || 
        this.previousCoordinates.longitude !== coordinates.longitude) {
      

      this.latitude = coordinates.latitude;
      this.longitude = coordinates.longitude; 

      this.marker = { latitude: this.latitude, longitude: this.longitude }; 
      this.previousCoordinates = { latitude: this.latitude, longitude: this.longitude }; 
    }
  }
  saveCoordinates(): void {
    if (this.latitude !== null && this.longitude !== null) {
      console.log('Saving Coordinates:', this.latitude, this.longitude);

      this.authService.user$.subscribe(user => {
        this.user = user;
      });

      this.tourService.getTouristById(this.user.id).subscribe(tourist => {
        if (tourist) {
          tourist.location.longitude = this.longitude!;
          tourist.location.latitude = this.latitude!;
          this.addUserMarker(tourist);  

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
  addUserMarker(user: Tourist): void {
    if (user.location && user.location.latitude && user.location.longitude) {
      const lat = user.location.latitude;
      const lng = user.location.longitude;

      if (this.map) {
        const blueIcon = L.icon({
          iconUrl: 'assets/images/dot.png',
          iconSize: [30, 30],
          iconAnchor: [20, 24],
        });

        this.markers.forEach(marker => {
          this.map.removeLayer(marker);
        });
        this.markers = [];
        if (this.userMarker) {
          this.userMarker.setLatLng([lat, lng]);  
          this.map.setView([lat, lng], 15); 
        } else {
          this.userMarker = L.marker([lat, lng], { icon: blueIcon }).addTo(this.map);
          this.map.setView([lat, lng], 15); 
          this.userMarker.bindPopup('Korisnikova lokacija: Latitude: ' + user.location.latitude + ', Longitude: ' + user.location.longitude);
        }

      } else {
        console.error('Mapa nije inicijalizovana.');
      }
    } else {
      console.error('Korisnik nema definisane koordinate.');
    }
  }
  
  private fixedMarkers: L.Marker[] = []; // Niz za javne fiksirane markere

  loadPublicPoints(): void {
    this.publicPointService.getAccpetedPublicPoints().subscribe({
      next: (publicPoints) => {
        publicPoints.forEach((point) => {
          const latLng = new L.LatLng(point.latitude, point.longitude);
  
          const marker = L.marker(latLng, {
            icon: L.icon({
              iconUrl: 'assets/images/placeholder.png',
              iconSize: [32, 41],
              iconAnchor: [15, 41],
            }),
          });
  
          const popupContent = `
            <div style="width: 250px; text-align: center;">
              <h3 style="margin: 0; font-size: 16px;">${point.name}</h3>
              ${point.imageUrl ? `<img src="${point.imageUrl}" alt="${point.name}" style="width: 100%; height: auto; margin: 10px 0; border-radius: 5px;" />` : ''}
              ${point.description ? `<p style="font-size: 14px; color: #555; margin: 0;">${point.description}</p>` : ''}
            </div>
          `;
  
          marker.bindPopup(popupContent).addTo(this.map);
          this.fixedMarkers.push(marker); 
        });
      },
      error: (err) => {
        console.error('Error loading public points:', err);
      },
    });
  }  

}
