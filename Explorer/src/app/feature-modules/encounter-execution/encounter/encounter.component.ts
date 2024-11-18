import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EncounterExecutionService } from '../encounter-execution.service';
import { Encounter } from '../model/encounter.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {

  encounters: Encounter[] = [];
  encounterCoordinates: { latitude: number, longitude: number }[] = [];
  isViewMode: boolean = false;
  @Output() encounterCoordinatesLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();

  constructor(private service: EncounterExecutionService, private router: Router){}

  ngOnInit(): void {
    this.getEncounters();
  };

  navigateToForm(id?: number): void {
    if (id) {
      this.router.navigate(['/encounter-update', id]);
    } else {
      this.router.navigate(['/encounter-add']);
    }
  }

  getEncounters(): void {
    this.service.getEncounters().subscribe({
      next: (data) => {
        const activeEncounters = data.results.filter(e => e.encounterStatus === 0);
        this.encounters = activeEncounters;
        this.encounterCoordinates = this.encounters.map(e => ({ latitude: e.encounterLocationDto.latitude, longitude: e.encounterLocationDto.longitude }));
        this.encounterCoordinatesLoaded.emit(this.encounterCoordinates);
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja encounter-a:', err);
      }
    });
  }
}
