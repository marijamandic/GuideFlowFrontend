import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';
//import { EventEmitter } from 'events';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})
export class TourReviewFormComponent {

  @Output() tourReviewUpdated = new EventEmitter<null>();

  constructor(private service: TourExecutionService){}

  tourReviewForm = new FormGroup({
    rating: new FormControl ('',[Validators.required]),
    comment: new FormControl ('',[Validators.required]),
    creationDate: new FormControl ('',[Validators.required]),
    tourDate: new FormControl ('',[Validators.required]),
  })

  handleClick(): void{
    console.log(this.tourReviewForm.value)

    const tourReview: TourReview = {
      rating: this.tourReviewForm.value.rating ? +this.tourReviewForm.value.rating : 0,
      comment: this.tourReviewForm.value.comment || '',
      creationDate: this.tourReviewForm.value.creationDate ? new Date("2024-01-01") : undefined,
      tourDate: this.tourReviewForm.value.creationDate ? new Date("2024-01-01") : undefined
    }

    this.service.handleClick(tourReview).subscribe({
      next:(_) => {
        this.tourReviewUpdated.emit()
      }
    });
  }

}

