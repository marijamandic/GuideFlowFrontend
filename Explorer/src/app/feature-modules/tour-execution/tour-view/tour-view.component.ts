import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourStatus } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent implements OnInit {

  allTours: Tour[] = [];

  constructor(private service: TourExecutionService) { }

  ngOnInit(): void {
    this.service.getAllTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.allTours = result.results.filter(tour => tour.status === TourStatus.Published);
        console.log(this.allTours[1].reviews); 
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  calculateAverageRating(reviews: { rating: number }[]): number {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}
