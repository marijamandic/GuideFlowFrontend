import { Component, OnInit } from '@angular/core';
import { TourSpecification } from '../model/tour-specification.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'xp-tour-specification',
  templateUrl: './tour-specification.component.html',
  styleUrls: ['./tour-specification.component.css']
})

export class TourSpecificationComponent implements OnInit {
  
 tourSpecification: TourSpecification[] = [];
 selectedTourSpecification: TourSpecification;
 shouldEdit: boolean;
 shouldRenderEquipmentForm: boolean = false;

  constructor(private service : MarketplaceService) {}

  ngOnInit(): void {
    // this.service.getTourSpecifications().subscribe({
    //   next: (result: PagedResults<TourSpecification>) => {
    //     this.tourSpecification = result.results;
    //   },
    //   error: (err: any) => {
    //     console.log(err)
    //   }
    // })
    this.getTourSpecifications();
  }

  getTourSpecifications() : void {
    this.service.getTourSpecifications().subscribe({
      next: (result: PagedResults<TourSpecification>) => {
        console.log("Tour specifications loaded:", result.results);
        this.tourSpecification = result.results;
      },
      error: () => {

      }
    })
  }
  
  onEditClicked(tourSpecification: TourSpecification) : void{
    this.selectedTourSpecification = tourSpecification;
    this.shouldEdit = true;
    this.shouldRenderEquipmentForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderEquipmentForm = true;
  }

  deleteTourSpecification(tourSpecification: TourSpecification) : void {
    this.service.deleteTourSpecification(tourSpecification).subscribe({
      next: (_) => {
        this.getTourSpecifications();
      }
    })
  }
}
