import { Component, OnInit } from '@angular/core';
import { Tour, Level, TourStatus } from '../model/tour.model';
import { Currency } from '../model/price.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  
  tour: Tour[] = [];
  selectedTour: Tour = this.initializeTour();
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;  
  currentView: string;
  user:User;

  constructor(private service: TourService,private authService:AuthService){}
  
  tours: Tour[] = [];
  draftTours: Tour[]=[];
  publishedTours: Tour[]=[];
  archivedTours: Tour[]=[];

  ngOnInit(): void {
      this.getTours();  
      this.authService.user$.subscribe(user => {
        this.user=user;
        if(user.role==="tourist"){
          this.currentView="published";
        }else{
          this.currentView="drafts";
        }
      });
  }

  initializeTour(): Tour {
    return {
      id: 0,
      authorId:-1,
      name: '',
      description: '',
      price: { cost: 0, currency: Currency.EUR },
      level: Level.Easy,
      status: TourStatus.Draft,
      lengthInKm: 0,
      averageGrade: 0.0,
      taggs: [],
      checkpoints: [],
      transportDurations: [],
      reviews: []
    };
  }


  getTours(): void{
    this.shouldRenderTourForm = false;
    this.shouldEdit = false;
    this.service.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.getDraftTours();
        this.getPublishedTours();
        this.getArchivedTours();
      },
      error: (err: any)=>{
        console.log(err)
      }
    })
   
  }

  getDraftTours():void{
    this.draftTours = this.tours.filter(t=> t.status === TourStatus.Draft);
  }
  getPublishedTours():void{
    this.publishedTours = this.tours.filter(t => t.status === TourStatus.Published)
  }
  getArchivedTours():void{
    this.archivedTours = this.tours.filter(t => t.status === TourStatus.Archived)
  }


  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTours();
      },
    })
  }
  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.selectedTour = this.initializeTour();
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
  }
   
  onPublish(tour:Tour): void {
    if(tour.id !== null && tour.id !== undefined){
      console.log(tour.id);
      this.service.changeStatus(tour.id,"Publish").subscribe({
        next: () => {
          console.log("promenjeno");
          this.getTours();
        },
        error: (err: any)=>{
          if(err.status===400){
            alert("You can't publish this tour!");
          }
          console.log(err)
        }
      })
    }
  }
  
  archiveTour(tour:Tour):void{
    if(tour.id !== null && tour.id !== undefined){
      this.service.changeStatus(tour.id,"Archive").subscribe({
        next: () => {
          this.getTours();
        },
        error: (err: any)=>{
          console.log(err)
        }
      })
    }
  }

  CurrencyMap = {
    0: 'RSD',
    1: 'EUR',
    2: 'USD'
  };

  LevelMap = {
      0: 'Easy',
      1: 'Advanced',
      2: 'Expert'
  };

  StatusMap = {
    0: 'Draft',
    1: 'Published',
    2: 'Archived'
  }
}

  

