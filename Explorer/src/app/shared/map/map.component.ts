import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import 'leaflet-routing-machine';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit,OnChanges {
  private map: any;
  private markers: L.Marker[] = [];
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

  constructor(private mapService: MapService) {}

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

  private initMap(): void {
    if (this.map) {
      console.log('Mapa je već inicijalizovana');
      return; // Sprečite ponovnu inicijalizaciju
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
        alert(`Total distance is ${totalDistanceKm} km and total time is ${totalTimeMinutes} minutes for walking`);
        this.distanceCalculated.emit({
          transportType: 'walking',
          time: totalTimeMinutes,
          distance: parseFloat(totalDistanceKm)
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
      const marker = new L.Marker([coord.lat, coord.lng]).addTo(this.map);
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
  
}
