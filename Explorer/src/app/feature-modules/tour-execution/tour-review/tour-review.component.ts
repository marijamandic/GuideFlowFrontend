import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit {

  @Output() tourReviewUpdated = new EventEmitter<null>();

  tourReviewForm = new FormGroup({
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    comment: new FormControl('', [Validators.required]),
    tourDate: new FormControl('', [Validators.required]),
  });

  tourId: number;
  touristId: number;

  rating: number = 0;
  hoverRatingIndex: number = 0; 

  constructor(
    private route: ActivatedRoute,
    private service: TourExecutionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tourId = Number(params.get('tourId')) || 0;
      this.touristId = Number(params.get('touristId')) || 0;
    });
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  hoverRating(rating: number): void {
    this.hoverRatingIndex = rating;
  }

  resetHover(): void {
    this.hoverRatingIndex = 0;
  }

  handleClick(): void {
    const tourReview: TourReview = {
      rating: this.rating,
      comment: this.tourReviewForm.value.comment || '',
      creationDate: new Date(), 
      tourDate: new Date(),
      percentageCompleted: 0, 
      touristId: this.touristId,
      tourId: this.tourId
    };

    this.service.getPercentage(this.tourId).subscribe({
      next: () => {
        this.tourReviewUpdated.emit();
        this.tourReviewForm.reset(); 
      },
      error: (err) => {
        console.error('Greška pri slanju recenzije:', err);
      }
    });
  }
}
