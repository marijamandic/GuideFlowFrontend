import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})
export class TourReviewFormComponent implements OnInit {

  @Output() tourReviewUpdated = new EventEmitter<null>();

  // Form model za unos ocene i komentara
  tourReviewForm = new FormGroup({
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)]),
    comment: new FormControl('', [Validators.required]),
    tourDate: new FormControl('', [Validators.required]),
  });

  // ID-evi preuzeti iz rutiranja
  touristId: number;
  tourId: number;

  constructor(
    private route: ActivatedRoute,
    private service: TourExecutionService
  ) {}

  ngOnInit(): void {
    // Preuzimanje `touristId` i `tourId` iz parametara rute
    this.touristId = +this.route.snapshot.paramMap.get('touristId')!;
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
  }

  handleClick(): void {
    // Priprema objekta `TourReview` za slanje
    console.log("EEEE")
    const tourReview: TourReview = {
      rating: this.tourReviewForm.value.rating ? +this.tourReviewForm.value.rating : 0,
      comment: this.tourReviewForm.value.comment || '',
      creationDate: new Date(), // Automatski postavljamo na trenutni datum
      tourDate: this.tourReviewForm.value.tourDate ? new Date(this.tourReviewForm.value.tourDate) : undefined,
      percentageCompleted: 0, // Trenutno je fiksirano na 0, jer nije deo trenutne logike
      touristId: this.touristId,
      tourId: this.tourId
    };

    // Pozivanje servisa za slanje recenzije
    this.service.handleClick(tourReview).subscribe({
      next: () => {
        this.tourReviewUpdated.emit();
        this.tourReviewForm.reset(); // Resetovanje forme nakon uspešnog slanja
      },
      error: (err) => {
        console.error('Greška pri slanju recenzije:', err);
      }
    });
  }
}
