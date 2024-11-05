import { Component, OnInit } from '@angular/core';
import { Currency, Level, Tour, TourStatus } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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
  forPublish: boolean = false;
  

  constructor(private service: TourService){}
  
  tours: Tour[] = [];
  draftTours: Tour[]=[];
  publishedTours: Tour[]=[];

  ngOnInit(): void {
      this.getTours();
      
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
    this.service.getTour().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        this.getDraftTours();
        this.getPublishedTours();
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
    this.selectedTour = tour;
    this.shouldEdit = true;
    this.forPublish = true;
    this.shouldRenderTourForm = true;
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

  

