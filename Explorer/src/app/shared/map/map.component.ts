import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import 'leaflet-routing-machine';

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
  @Output() markerAdded = new EventEmitter<L.LatLng>();
  @Output() mapReset = new EventEmitter<void>();

  constructor(private mapService: MapService) {}

  private initMap(): void {
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

    // Dodajemo inicijalne markere ako ih ima
    this.initialMarkers.forEach((latLng) => {
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });
  }

  setRoute(waypoints: L.LatLng[]): void {
    if (waypoints.length > 1) {
      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
      }

      // Kreiramo kontrolu za rutu između proizvoljnih tačaka
      this.routeControl = L.Routing.control({
        waypoints: waypoints,
        router: L.routing.mapbox('pk.eyJ1IjoicmF0a292YWMiLCJhIjoiY20ybDJmdGNxMDdkMjJrc2dodncycWhhZiJ9.fkyW7QT3iz7fxVS5u5w1bg', { profile: 'mapbox/walking' })
      }).addTo(this.map);

      // Prikazujemo obaveštenje o udaljenosti i vremenu
      this.routeControl.on('routesfound', (e: { routes: any; }) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        alert('Total distance is ' + (summary.totalDistance / 1000).toFixed(2) + ' km and total time is ' + Math.round(summary.totalTime / 60) + ' minutes');
      });
    }
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
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
      const coord = e.latlng;
      const marker = new L.Marker([coord.lat, coord.lng]).addTo(this.map);
      this.addMarker(marker);
      this.markerAdded.emit(coord); // Emitujemo događaj kada se marker doda
    });
  }

  addMarker(marker: L.Marker): void {
    this.markers.push(marker);

    // Ako su postavljeni više od 2 markera, crtamo rutu između svih
    if (this.markers.length > 1) {
      const waypoints = this.markers.map(m => m.getLatLng());
      this.setRoute(waypoints);
    }
  }

  resetMap(): void {
    // Uklanjamo sve markere
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    // Uklanjamo rutu ako postoji
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }

    this.mapReset.emit(); // Emitujemo događaj kada se mapa resetuje
  }
}
