import { Component, EventEmitter, Input, numberAttribute, OnInit, Output } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Level, Tour } from '../../tour-authoring/model/tour.model';
import { Checkpoint } from '../../tour-authoring/model/tourCheckpoint.model';
import { TourReview } from '../../tour-authoring/model/tourReview';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { environment } from 'src/env/environment';
import { Currency, Price } from '../../tour-authoring/model/price.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TransportDuration, TransportType } from '../model/transportDuration.model';

@Component({
  selector: 'xp-tour-author-details',
  templateUrl: './tour-author-details.component.html',
  styleUrls: ['./tour-author-details.component.css']
})
export class TourAuthorDetailsComponent {
  user : User
  tourId : number | null;
  tour: Tour;
  status : string;
  checkpoints: Checkpoint[] = [];
  reviews:TourReview[];
  checkpointCoordinates: { latitude: number; longitude: number; name: string; description: string; imageUrl?: string; }[] = [];
  @Input() forUpdating : boolean;
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; name: string; description: string; imageUrl?: string; }[]>();
  MapViewMode:boolean = false;
  shouldEdit:boolean = false;
  selectedCheckpoint:Checkpoint;
  allTransportData: { transportType: string; time: number; distance: number }[] = [];
  transportDurations: TransportDuration[] = [];
  isModalOpen: boolean = false;
  isTourModalOpen:boolean = false;

  constructor(private authService: AuthService, private router:Router, private route: ActivatedRoute, private tourService:TourService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTour();
  }

  loadTour():void {
    if(this.tourId != null){
      this.tourService.getTourById(this.tourId).subscribe({
        next: (result) => {
          this.tour = result; 
          if(this.tour.status === 0){
            this.status = 'Draft';
          }
          else if(this.tour.status === 1){
            this.status = 'Published';
          }
          else if(this.tour.status === 2){
            this.status = 'Archived';
          }else{
            this.status = 'Deleted';
          }
          console.log(this.status)
          this.reviews = this.tour.reviews;
          this.reviews = this.tour.reviews.map((review) => ({
            ...review,
            creationDate: review.creationDate 
              ? (review.creationDate instanceof Date ? review.creationDate : new Date(review.creationDate))
              : new Date(),
          }));
          this.tour.averageGrade = this.getAverageGrade();
          this.checkpoints = this.tour.checkpoints;
          if(this.checkpoints.length < 2){
            this.tour.lengthInKm = 0;
          }
          this.checkpointCoordinates = this.checkpoints.map(cp => ({
            latitude: cp.latitude,
            longitude: cp.longitude,
            name: cp.name,
            description: cp.description,
            imageUrl: this.getImagePath(cp.imageUrl)
          }));
          this.checkpointsLoaded.emit(this.checkpointCoordinates);
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
      });
    }
  }

  getImagePath(imageUrl: string | undefined){
    if(imageUrl!==undefined){
      return environment.webRootHost+imageUrl;
    }
    return "";
  }

  getLevel(level: Level): string {
    switch (level) {
      case Level.Easy:
        return 'Easy';
      case Level.Advanced:
        return 'Advanced';
      case Level.Expert:
        return 'Expert';
      default:
        return 'Unknown';
    }
  }
  
  getStars(): string[] {
    if (!this.tour || !this.tour.averageGrade) return [];
  
    const fullStars = Math.floor(this.tour.averageGrade);
    const hasHalfStar = this.tour.averageGrade % 1 >= 0.5;
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);

    const stars = Array(5).fill('empty'); 
    stars.fill('full', 0, fullStars); 
    if (hasHalfStar && fullStars < 5) {
      stars[fullStars] = 'half';
    }
  
    return stars;
  }
  
  getStarsFromRating(rating: number | undefined): string[] {
    if (!rating) return [];
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
  
    return [
      ...Array(fullStars).fill('full'),
      ...(hasHalfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty'),
    ];
  }

  getAverageGrade(): number {
    if (this.tour !== null && this.reviews.length > 0) {
      let sumGrade = 0;
      this.reviews.forEach(review => {
        if(review.rating !== undefined)
          sumGrade += review.rating;
      });
      return sumGrade / this.reviews.length;
    }
    return 0;
  }

  openModal(): void {
    if(this.shouldEdit){
      this.shouldEdit = false;
    }
    this.isModalOpen = true;
  }
  
  closeModal(): void {
    this.isModalOpen = false;
  }

  openTourModal():void{
    this.isTourModalOpen = true;
  }

  closeTourModal():void{
    this.isTourModalOpen = false;
  }

  editCheckpoint(checkpoint: Checkpoint): void {
    this.selectedCheckpoint=checkpoint;
    this.isModalOpen = true;
    this.shouldEdit=true;
  }

  deleteCheckpoint(checkpoint: Checkpoint): void {
    if (checkpoint.id !== undefined && this.tourId) {
      this.tourService.deleteCheckpoint(this.tourId,checkpoint).subscribe({
        next: () => {
          this.loadTour();
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
  
  onCheckpointUpdated(): void {
    this.loadTour(); // Osvježavanje liste checkpointa
    this.closeModal(); // Zatvaranje modala
    if(this.shouldEdit){
      this.shouldEdit=false;
    }
  }

  onTourUpdated(): void {
    this.loadTour(); // Osvježavanje liste checkpointa
    this.closeTourModal(); // Zatvaranje modala
  }
  
  onDistanceCalculated(event: { transportType: string; time: number; distance: number }):void{
      this.addNewTransportData(event);
      if(event.transportType==='walking'){
        if(this.tourId !== null){
          this.tourService.updateTourLength(this.tourId,event.distance).subscribe({
            next: (data) => {
              console.log('Updated length:'+ data.lengthInKm);
              if(this.tour.lengthInKm !== data.lengthInKm){
                this.loadTour();
              }
            },
            error: (err) => {
              console.error('Greška prilikom update length-a:', err);
            }
          });
        }
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
      if(this.tourId !== null){
        this.tourService.addTransportDurations(this.tourId,this.transportDurations).subscribe({
          next: (data) => {
            console.log('Transport Durations added:'+ data.transportDurations);
            this.router.navigate(['/all-tours']);
            alert("Tour with checkpoints saved succesfully!");
          },
          error: (err) => {
            console.error('Greška prilikom add-a transport durations-a:', err);
          }
        });
      }
    }else{
      alert("You can't finish adding checkpoint without minimum 2 checkpoints and 1 transport duration!");
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

  goToAllTours(){
    this.router.navigate(['/all-tours']);
  }
}
