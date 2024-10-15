import { Component, OnInit } from '@angular/core';
import { TourObject } from '../model/tourObject.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-object',
  templateUrl: './tour-object.component.html',
  styleUrls: ['./tour-object.component.css']
})
export class TourObjectComponent implements OnInit {

  tourObjects: TourObject[] = [];
  
  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.service.getTourObjects().subscribe({
      next: (result: PagedResults<TourObject>) => {
        this.tourObjects = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
