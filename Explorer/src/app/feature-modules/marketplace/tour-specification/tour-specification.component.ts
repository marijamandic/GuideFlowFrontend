import { Component, OnInit } from '@angular/core';
import { TourSpecification } from '../model/tour-specification.model';
import { TourSpecificationService } from '../tour-specification.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-specification',
  templateUrl: './tour-specification.component.html',
  styleUrls: ['./tour-specification.component.css']
})

export class TourSpecificationComponent implements OnInit {
  
  tourSpecification: TourSpecification[] = [];
  constructor(private service : TourSpecificationService) {}

  ngOnInit(): void {
    this.service.getTourSpecifications().subscribe({
      next: (result: PagedResults<TourSpecification>) => {
        this.tourSpecification = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  
}
