import { Component } from '@angular/core';
import { AppRating } from '../model/AppRating.model';
import { AppRatingService } from '../layout.service';

@Component({
  selector: 'rating-the-app',
  templateUrl: './rating-the-app.component.html',
  styleUrls: ['./rating-the-app.component.css']
})
export class RatingTheAppComponent {
  rating: AppRating = {
    ratingId: 3,
    userId: 6,
    ratingValue: 0,
    comment: '',
    ratingTime: new Date().toISOString()
  };

  submitted: boolean = false;  

  constructor(private appRatingService: AppRatingService) {}

  onSubmit() {
    this.appRatingService.postNewAppRating(this.rating).subscribe(
      (response) => {
        console.log('Rating submitted successfully:', response);
        this.submitted = true;
      },
      (error) => {
        console.error('Error submitting rating:', error);
      }
    );
  }
}
