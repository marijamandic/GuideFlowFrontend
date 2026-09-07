import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import 'leaflet-routing-machine';
import { PublicPointService } from 'src/app/feature-modules/tour-authoring/tour-public-point.service';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private markers: L.Marker[] = [];
  searchAddress: string = '';
  private routeControl: any = null;

  @Input() initialMarkers: L.LatLng[] = [];
  @Input() allowMultipleMarkers: boolean = true;
  @Input() checkpoints: { latitude: number; longitude: number; name?: string; description?: string; imageUrl?: string; }[] = [];
  @Input() encounters: { latitude: number; longitude: number }[] = [];
  @Input() showSearchBar: boolean = true;
  @Input() isAddCheckpoints: boolean = false;
  @Input() formWithoutSearchBar: boolean =false;
  @Input() userLocation: { latitude: number; longitude: number } | null = null;
  @Output() markerAdded = new EventEmitter<L.LatLng>();
  @Output() mapReset = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() distanceCalculated = new EventEmitter<{ transportType: string; time: number; distance: number }>();
  @Output() publicPointSelected = new EventEmitter<any>();

  constructor(private mapService: MapService, private publicPointService: PublicPointService) {}

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off(); // Uklonite sve event listenere
      this.map.remove(); // Uklonite mapu
      this.map = null; // Postavite mapu na null kako biste oslobodili resurse
    }
  }

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
    (window as any).selectPublicPoint = (latitude: number, longitude: number, name: string, description: string, imageUrl: string) => {
      const publicPoint = { latitude, longitude, name, description, imageUrl };
      this.publicPointSelected.emit(publicPoint);
    };
  }

  public initMap(): void {
    if (this.map) {
      console.log('Mapa je već inicijalizovana');
      this.resetMap()
      return; // Sprečite ponovnu inicijalizaciju
    }else{
      this.map = L.map('map', {
        center: [45.2396, 19.8227],
        zoom: 13,
      });
      console.log(this.map)
      
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
    if(this.formWithoutSearchBar){
      this.registerOnClickForm();
    }else{
      this.registerOnClick();
    }

    this.initialMarkers.forEach((latLng) => {
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });

    this.checkpoints.forEach((checkpoint) => {
      const latLng = new L.LatLng(checkpoint.latitude, checkpoint.longitude);
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });
    if(!this.showSearchBar){
      this.updateCheckpointMarkers();
    }
  }

  setRoute(waypoints: L.LatLng[]): void {
    if (waypoints.length > 1) {
      if (this.routeControl) {
        if (this.map.hasLayer(this.routeControl)) {
          this.map.removeControl(this.routeControl);
        }
        this.routeControl = null; // Resetujte kontroler da biste osigurali da nije `null`
      }

      this.routeControl = L.Routing.control({
        waypoints: waypoints,
        router: L.routing.mapbox('pk.eyJ1IjoicmF0a292YWMiLCJhIjoiY20ybDJmdGNxMDdkMjJrc2dodncycWhhZiJ9.fkyW7QT3iz7fxVS5u5w1bg', { profile: 'mapbox/walking' })
      }).addTo(this.map);

      this.routeControl.on('routesfound', (e: { routes: any; }) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const totalDistanceKm = (summary.totalDistance / 1000).toFixed(2);
        const totalTimeMinutes = Math.round(summary.totalTime / 60);
        //alert(`Total distance is ${totalDistanceKm} km and total time is ${totalTimeMinutes} minutes for walking`);
        this.distanceCalculated.emit({
          transportType: 'walking',
          time: totalTimeMinutes,
          distance: parseFloat(totalDistanceKm)
        });
      });
    }
  }

  ngOnChanges(): void {
     console.log(this.map)
     //if (this.map) {
     //  setTimeout(() => this.map.invalidateSize(), 0); // Osvežavanje dimenzija mape
     //}
     if (this.map) {
       this.updateCheckpointMarkers();
       this.addUserMarker();
     } //else {
       //this.map.invalidateSize();
       //}
  }

  private updateCheckpointMarkers(): void {
    this.resetMap(); 
    this.checkpoints.forEach(checkpoint => {
      const latLng = new L.LatLng(checkpoint.latitude, checkpoint.longitude);
      const popupContent = `
      <div style="width: 75px; text-align: center; padding: 3px;">
        <h5 style="margin: 0; font-size: 12px; font-weight: bold;">${checkpoint.name}</h5>
        ${checkpoint.imageUrl ? `<img src="${checkpoint.imageUrl}" alt="Checkpoint Image" style="width: 100%; height: auto; margin: 3px 0; border-radius: 3px;" />` : ''}
        ${checkpoint.description ? `<p style="font-size: 11px; color: #666; margin: 0;">${checkpoint.description}</p>` : ''}
      </div>
      `;
      const marker = L.marker(latLng).bindPopup(popupContent).addTo(this.map);
      marker.on('click', () => {
        marker.openPopup();
      });
      this.addMarker(marker);
    });
    
  
    if (this.markers.length > 1) {
      const waypoints = this.markers.map(m => m.getLatLng());
      this.setRoute(waypoints);
    }

    this.encounters.forEach((encounter) => {
      const latLng = new L.LatLng(encounter.latitude, encounter.longitude);
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });
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
  registerOnClickForm(): void {
    this.map.on('click', (e: any) => {
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = [];
      const coord = e.latlng;
      const marker = new L.Marker([coord.lat, coord.lng]).addTo(this.map);
      this.markers.push(marker); 
      this.coordinatesSelected.emit({ latitude: coord.lat, longitude: coord.lng });
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
      const marker = new L.Marker([coord.lat, coord.lng]).addTo(this.map);
      this.markers.push(marker); 
      this.coordinatesSelected.emit({ latitude: coord.lat, longitude: coord.lng });
    });
  }

  private addUserMarker(): void {
    if (!this.userLocation) {
      console.log('Korisnička lokacija nije dostupna.');
      return;
    }
  
    console.log('Dodajem marker za korisnika na:', this.userLocation);
  
    const userIcon = L.icon({
      iconUrl: '/assets/images/map-marker.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
    });
  
    const userMarker = L.marker([this.userLocation.latitude, this.userLocation.longitude], { icon: userIcon })
      .addTo(this.map)
      .bindPopup('You are here');
  
    this.addMarker(userMarker);
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
            <div style="width: 150px; text-align: center; padding: 3px;">
              <h5 style="margin: 0; font-size: 12px; font-weight: bold;">${point.name}</h5>
              ${point.imageUrl ? `<img src="${point.imageUrl}" alt="${point.name}" style="width: 100%; height: auto; margin: 3px 0; border-radius: 3px;" />` : ''}
              ${point.description ? `<p style="font-size: 11px; color: #666; margin: 0;">${point.description}</p>` : ''}
              ${this.isAddCheckpoints ? `
                <button 
                  style="margin-top: 5px; padding: 5px 10px; font-size: 12px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;" 
                  onclick="selectPublicPoint(${point.latitude}, ${point.longitude}, '${point.name}', '${point.description}', '${point.imageUrl}')">
                  Select Point
                </button>` : ''}
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
   
  public resetPositionSimMap(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 0);
    }
  }
}
