import { Component, OnInit } from '@angular/core';
import { TourCheckpointService } from '../tour-checkpoint.service';
import { Checkpoint } from '../model/tourCheckpoint.model';

@Component({
  selector: 'xp-checkpoint-list',
  templateUrl: './tour-checkpoint.component.html',
  styleUrls: ['./tour-checkpoint.component.css']
})
export class CheckpointListComponent implements OnInit {
checkpoints: Checkpoint[] = []; // Očekuje se da ovo bude niz

  constructor(private checkpointService: TourCheckpointService) {}

  ngOnInit(): void {
    this.loadCheckpoints();
  }

  loadCheckpoints(page: number = 1, pageSize: number = 10): void {
    this.checkpointService.getCheckpoints(page, pageSize).subscribe({
      next: (data) => {
        this.checkpoints = data.results; 
        console.log(this.checkpoints);
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja checkpoint-a:', err);
      }
    });
  }
}
