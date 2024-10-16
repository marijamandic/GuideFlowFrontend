import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourService } from '../tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  
  constructor(private service: TourService){}
  
  tours: Tour[] = [];

  ngOnInit(): void {
      this.service.getTour().subscribe({
        next: (result: PagedResults<Tour>) => {
          this.tours = result.results;
        },
        error: (err: any)=>{
          console.log(err)
        }
      })
  }

}
