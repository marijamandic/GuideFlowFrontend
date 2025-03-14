import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/shared/map/map.service';
import 'leaflet-routing-machine';
import { TourService } from '../../tour-authoring/tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tourist } from '../../tour-authoring/model/tourist';

@Component({
  selector: 'xp-encounter-execution-map',
  templateUrl: './encounter-execution-map.component.html',
  styleUrls: ['./encounter-execution-map.component.css']
})
export class EncounterExecutionMapComponent implements AfterViewInit,OnChanges {
  private map: any;
  private markers: L.Marker[] = [];
  private userMarker: L.Marker | null = null;  // Dodajemo referencu na korisnikov marker
  searchAddress: string = '';
  private routeControl: any = null;
  user : User;
  latitude: number | null = null;  
  longitude: number | null = null;
  private encounterMarkers: L.Marker[] = [];
  private previousCoordinates: { latitude: number; longitude: number } | null = null; 
  private selectedMarkerLatLng: L.LatLng | null = null;


  @Input() initialMarkers: L.LatLng[] = [];
  @Input() allowMultipleMarkers: boolean = true;
  @Input() encounters: { latitude: number; longitude: number }[] = [];
  @Input() showSearchBar: boolean = true;
  @Output() markerAdded = new EventEmitter<L.LatLng>();
  @Output() mapReset = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() locationChanged = new EventEmitter<{ latitude: number; longitude: number }>();

  constructor(private mapService: MapService, private tourService: TourService, private authService : AuthService) {}
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
  }

  public initMap(): void {
    if (this.map) {
      console.log('Mapa je već inicijalizovana');
      //this.resetMap()
      return; // Sprečite ponovnu inicijalizaciju
    }else{
      this.map = L.map('map', {
        center: [45.2396, 19.8227],
        zoom: 13,
      });
    }

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
  }

  ngOnChanges(): void {
    console.log(this.map)
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 0); // Osvežavanje dimenzija mape
    }
    if (this.map) {
      this.updateMarkers();
    } else {
      this.map.invalidateSize();
    }
  }

  private updateMarkers(): void {
    this.resetEncounterMarkers(); // Resetuje samo encounter markere
  
    this.encounters.forEach((encounter) => {
      const latLng = new L.LatLng(encounter.latitude, encounter.longitude);
  
      const icon = L.icon({
        iconUrl: 'assets/images/star.png',
        iconSize: [41, 41],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
  
      const marker = L.marker(latLng, { icon }).addTo(this.map);
      this.encounterMarkers.push(marker); // Dodajte marker u encounterMarkers niz
  
      // Dodajte klik događaj na marker
      marker.on('click', () => {
        this.selectedMarkerLatLng = latLng; // Sačuvajte lokaciju izabranog markera
        this.drawRouteToMarker(latLng); // Iscrtajte rutu do izabranog markera
      });
      });
  }
  

  private resetEncounterMarkers(): void {
    this.encounterMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.encounterMarkers = [];
  }

  search(): void {
    this.mapService.search(this.searchAddress).subscribe({
      next: (result) => {
        // Koordinate iz rezultata pretrage
        const lat = result[0].lat;
        const lng = result[0].lon;
  
        // Uklanjamo prethodne markere
        this.markers.forEach(marker => {
          this.map.removeLayer(marker);
        });
        this.markers = [];
  
        // Čuvamo koordinate
        this.latitude = lat;
        this.longitude = lng;
  
        // Kreiramo isti custom icon kao kod klika
        const customIcon = L.icon({
          iconUrl: 'assets/images/pin.png',
          iconSize: [41, 41],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
  
        // Dodajemo marker sa custom ikonom
        const marker = new L.Marker([lat, lng], { icon: customIcon }).addTo(this.map);
        this.markers.push(marker);
  
        // Emitujemo događaj coordinatesSelected, isto kao kod klika na mapu
        this.coordinatesSelected.emit({ latitude: lat, longitude: lng });
        
        // Opcionalno: Podesimo mapu da prikaže ovaj marker i otvorimo popup ako želite
        marker.bindPopup('Rezultat pretrage: ' + this.searchAddress).openPopup();
        this.map.setView([lat, lng], 15); 
      },
      error: () => {
        console.error('Greška prilikom pretrage adrese.');
      },
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
    this.searchAddress = "";
  
    // Uklonite samo korisnikove markere
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
      this.userMarker = null;
    }
  
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }
  
    this.mapReset.emit();
  }

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
          this.locationChanged.emit({ latitude: tourist.location.latitude, longitude: tourist.location.longitude });
  
          this.tourService.updateTourist(tourist).subscribe(updatedTourist => {
            console.log('Updated User:', updatedTourist);
  
            // Ponovo iscrtaj rutu ako postoji izabrani marker
            if (this.selectedMarkerLatLng) {
              this.drawRouteToMarker(this.selectedMarkerLatLng);
            }
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
  
        // Uklanja samo korisnikov marker, ne encounter markere
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

  private drawRouteToMarker(targetLatLng: L.LatLng): void {
    // Uklonite prethodnu rutu ako postoji
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }
  
    // Kreirajte novu rutu koristeći leaflet-routing-machine bez prikazivanja markera
    this.routeControl = L.Routing.control({
      waypoints: [
        L.latLng(this.userMarker?.getLatLng() || { lat: 0, lng: 0 }), // Početna tačka je korisnikova lokacija
        targetLatLng, // Krajnja tačka je lokacija kliknutog encounter markera
      ],
      routeWhileDragging: true,
      show: false, // Sakrijte rutu detalje
      addWaypoints: false,
      createMarker: () => null, // Onemogućite prikaz markera
    } as L.Routing.RoutingControlOptions & { createMarker: any }).addTo(this.map);
  }
  clearRoute(): void {
    if (this.routeControl) {
      this.map.removeControl(this.routeControl); // Uklonite rutu sa mape
      this.routeControl = null; // Resetujte referencu na routeControl
      console.log('Route cleared');
    } else {
      console.log('No route to clear');
    }
  }  
}
