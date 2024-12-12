import { Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/shared/map/map.service';
import 'leaflet-routing-machine';
import { PublicPointService } from 'src/app/feature-modules/tour-authoring/tour-public-point.service';

@Component({
  selector: 'xp-tour-add-checkpoint-map',
  templateUrl: './tour-add-checkpoint-map.component.html',
  styleUrls: ['./tour-add-checkpoint-map.component.css']
})
export class TourAddCheckpointMapComponent implements AfterViewInit{
  private map: any;
  private markers: L.Marker[] = [];
  searchAddress: string = '';
  private routeControl: any = null;
  
  @Input() initialMarkers: L.LatLng[] = [];
  @Input() checkpoint: { latitude: number; longitude: number; name?: string; description?: string; imageUrl?: string; } ;
  @Output() markerAdded = new EventEmitter<L.LatLng>();
  @Output() mapReset = new EventEmitter<void>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() publicPointSelected = new EventEmitter<any>();
  @Input() isEditing:boolean = false;

  constructor(private mapService: MapService, private publicPointService: PublicPointService) {}

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
      this.map.remove(); // Uništi prethodnu mapu
    }
  
    this.map = L.map('add-checkpoint-map', {
      center: [45.2396, 19.8227], // Primer koordinata za Novi Sad
      zoom: 13,
      zoomControl: false
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

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.registerOnClick();

    this.initialMarkers.forEach((latLng) => {
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    });

    if(this.isEditing){
      const latLng = new L.LatLng(this.checkpoint.latitude, this.checkpoint.longitude);
      const marker = L.marker(latLng).addTo(this.map);
      this.addMarker(marker);
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
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
              ${ true ? `
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
}
