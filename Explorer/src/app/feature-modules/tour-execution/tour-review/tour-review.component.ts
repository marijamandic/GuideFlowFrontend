import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit {
  @Output() tourReviewUpdated = new EventEmitter<null>();
  
  @Input() tourId: number = 0;
  @Input() touristId: number = 0;
  @Input() startDate: Date | null | undefined;
  @Input() percentageCompleted: number = 0;

  tourReviewForm = new FormGroup({
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    comment: new FormControl('', [Validators.required]),
  });

  rating: number = 0;
  hoverRatingIndex: number = 0; 

  constructor(private service: TourExecutionService) {}

  ngOnInit(): void {}

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
      tourDate: this.startDate ?? new Date(),
      percentageCompleted: this.percentageCompleted, 
      touristId: this.touristId,
      tourId: this.tourId
    };

    this.service.handleClick(tourReview).subscribe({
      next: () => {
        this.tourReviewUpdated.emit();
        this.tourReviewForm.reset(); 
      },
      error: (err) => {
        console.error('Error submitting review:', err);
      }
    });
  }
}
