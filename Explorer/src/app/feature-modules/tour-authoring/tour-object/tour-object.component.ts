import { Component, OnInit } from '@angular/core';
import { TourObject } from '../model/tourObject.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-tour-object',
  templateUrl: './tour-object.component.html',
  styleUrls: ['./tour-object.component.css']
})
export class TourObjectComponent implements OnInit {

  tourObjects: TourObject[] = [];
  shouldRenderTourObjectForm: boolean = false;
  shouldEdit: boolean = false;
  
  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.getTourObjects();
  }

  getTourObjects(): void {
    this.service.getTourObjects().subscribe({
      next: (result: PagedResults<TourObject>) => {
        this.tourObjects = result.results;
      },
      error: () => {
      }
    })
  }

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourObjectForm = true;
  }

  getCategoryName(category: number): string {
    switch (category) {
      case 0:
        return 'Parking';
      case 1:
        return 'Restaurant';
      case 2:
        return 'Toilet';
      case 3:
        return 'Other';
      default:
        return 'Unknown';
    }
  }
}
