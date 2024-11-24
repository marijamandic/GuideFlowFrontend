import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Checkpoint } from '../model/tourCheckpoint.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourService } from '../tour.service';
import { TransportDuration, TransportType } from '../model/transportDuration.model';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/env/environment';
import { Tour } from '../model/tour.model';


@Component({
  selector: 'xp-checkpoint-list',
  templateUrl: './tour-checkpoint.component.html',
  styleUrls: ['./tour-checkpoint.component.css']
})
export class CheckpointListComponent implements OnInit {
  tourId!: number;
  checkpoints: Checkpoint[] = [];
  selectedCheckpoint:Checkpoint;
  checkpointCoordinates: { latitude: number, longitude: number }[] = [];
  @Input() forUpdating : boolean;
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; }[]>();
  shouldRenderCheckpointForm:boolean = false;
  shouldEdit:boolean = false; 
  isViewMode:boolean = false;
  isComplete:boolean = false;
  showFeedback:boolean= false;
  allTransportData: { transportType: string; time: number; distance: number }[] = [];
  transportDurations: TransportDuration[] = [];
  
  constructor(private tourService: TourService,private router:Router,private route: ActivatedRoute) {}

  toggleAddCheckpointForm() {
    this.shouldRenderCheckpointForm=true;
  }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));
    this.loadCheckpoints();
  }
  
  loadCheckpoints(): void {
    this.shouldRenderCheckpointForm=false;
    this.shouldEdit=false;
    this.tourService.getTourById(this.tourId).subscribe({
      next: (data) => {
        this.checkpoints = data.checkpoints; 
        this.checkpointCoordinates = this.checkpoints.map(cp => ({ latitude: cp.latitude, longitude: cp.longitude }));
        this.checkpointsLoaded.emit(this.checkpointCoordinates);
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja checkpoint-a:', err);
      }
    });
  }

  getImagePath(imageUrl: string | undefined){
    if(imageUrl!==undefined){
      return environment.webRootHost+imageUrl;
    }
    return "";
  }

  editCheckpoint(checkpoint: Checkpoint): void {
    this.selectedCheckpoint=checkpoint;
    this.shouldRenderCheckpointForm=true;
    this.shouldEdit=true;
  }

  
  deleteCheckpoint(checkpoint: Checkpoint): void {
    if (checkpoint.id !== undefined && this.tourId) {
      this.tourService.deleteCheckpoint(this.tourId,checkpoint).subscribe({
        next: () => {
          this.loadCheckpoints();
          console.log('Checkpoint deleted with ID:', checkpoint.id);
        },
        error: (err: any) => {
          console.error('Error deleting checkpoint:', err);
        }
      });
    } else {
      console.error('Checkpoint ID is undefined, cannot delete.');
    }
  }

    onDistanceCalculated(event: { transportType: string; time: number; distance: number }):void{
      this.addNewTransportData(event);
      if(event.transportType==='walking'){
        this.tourService.updateTourLength(this.tourId,event.distance).subscribe({
          next: (data) => {
            console.log('Updated length:'+ data.lengthInKm);
          },
          error: (err) => {
            console.error('Greška prilikom update length-a:', err);
          }
        });
      }
  }

  addNewTransportData(event: { transportType: string; time: number; distance: number }): void {
    const existingEventIndex = this.allTransportData.findIndex(
      e => e.transportType === event.transportType
    );

    if (existingEventIndex !== -1) {
      this.allTransportData.splice(existingEventIndex, 1);
    }

    this.allTransportData.push(event);
  }

  finishCheckpointsAdding():void{
    this.CreateTransportDurations();
    console.log('usao u finish');
    if(this.checkpoints.length>=2 && this.transportDurations.length>=1){
      this.tourService.addTransportDurations(this.tourId,this.transportDurations).subscribe({
        next: (data) => {
          console.log('Transport Durations added:'+ data.transportDurations);
          if(!this.forUpdating){
            this.router.navigate(['/tour']);
            this.isComplete = true;
            this.showFeedback = true;
          }
          this.router.navigate(['/tourDetails',this.tourId])
          //alert("Tour with checkpoints added succesfully!");
          this.isComplete = true;
          this.showFeedback = true;
        },
        error: (err) => {
          console.error('Greška prilikom add-a transport durations-a:', err);
        }
      });
    }else{
      //alert("You can't finish adding checkpoint without minimum 2 checkpoints and 1 transport duration!");
      this.isComplete = false;
      this.showFeedback = true;
    }
  }

  CreateTransportDurations():void{
    this.transportDurations = this.allTransportData.map(data => {
      let transportTypeEnum: TransportType;
    
      if (data.transportType === 'walking') {
        transportTypeEnum = TransportType.Walking;
      } else if (data.transportType === 'cycling') {
        transportTypeEnum = TransportType.Bicycle;
      } else if (data.transportType === 'driving') {
        transportTypeEnum = TransportType.Car;
      } else {
        throw new Error(`Unknown transport type: ${data.transportType}`);
      }
    
      return {
        time: data.time,
        transportType: transportTypeEnum
      };
    });
  }
}
