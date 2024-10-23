import { Component, OnInit } from '@angular/core';
import { AppRating } from '../model/AppRating.model';
import { AppRatingService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'rating-the-app',
  templateUrl: './rating-the-app.component.html',
  styleUrls: ['./rating-the-app.component.css']
})
export class RatingTheAppComponent implements OnInit {
  rating: AppRating = {
    ratingId: 3,
    userId: 6,
    ratingValue: 0,
    comment: ' ',
    ratingTime: new Date().toISOString()
  };

  user: User | undefined;
  submitted: boolean = false;  

  constructor(
    private appRatingService: AppRatingService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;

      if (user) {
        this.rating.userId = user.id; 
        console.log(user.username);
      }
    });
  }

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
