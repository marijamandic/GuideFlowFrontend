import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TourBundle } from '../model/tour-bundle.model';
import { TourService } from '../../tour-authoring/tour.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Level, Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { Currency } from '../../tour-authoring/model/price.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
@Component({
  selector: 'xp-tour-bundle-dialog',
  templateUrl: './tour-bundle-dialog.component.html',
  styleUrls: ['./tour-bundle-dialog.component.css']
})
export class TourBundleDialogComponent implements OnInit{
  bundleName: string = '';
  bundlePrice: number
  selectedToursIds: number[] = []
  selectedTours: Tour[] = []
  availableTours: Tour[] = []
  user: User

  constructor(public dialogRef: MatDialogRef<TourBundleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TourBundle, private tourService: TourService, private authService: AuthService
  ) {
    if (data) {
      this.bundleName = data.name
      this.bundlePrice = data.price
      this.selectedToursIds = data.tourIds
    }

    this.availableTours = [
      {
        id: 8,
        authorId: 101,
        name: 'Sunset Trail Adventure',
        description: 'Enjoy a scenic sunset view along this easy-to-moderate trail.',
        price: { cost: 25, currency: Currency.EUR },
        level: Level.Easy,
        status: TourStatus.Published,
        StatusChangeDate: new Date('2024-01-15'),
        lengthInKm: 5.5,
        averageGrade: 2.3,
        taggs: ['scenic', 'family-friendly', 'nature'],
        checkpoints: [], // Placeholder as requested
        transportDurations: [],
        reviews: []
      },
      {
        id: 9,
        authorId: 102,
        name: 'Mountain Explorer Challenge',
        description: 'A challenging tour for experienced hikers seeking adventure.',
        price: { cost: 50, currency: Currency.USD },
        level: Level.Expert,
        status: TourStatus.Published,
        StatusChangeDate: undefined, // No status change date for drafts
        lengthInKm: 15,
        averageGrade: 8.4,
        taggs: ['adventure', 'mountains', 'challenging'],
        checkpoints: [], // Placeholder as requested
        transportDurations: [],
        reviews: []
      },
      {
        id: 10,
        authorId: 103,
        name: 'Historic City Walk',
        description: 'Discover the historic landmarks of the city on this guided tour.',
        price: { cost: 20, currency: Currency.EUR },
        level: Level.Easy,
        status: TourStatus.Published,
        StatusChangeDate: new Date('2023-12-01'),
        lengthInKm: 3,
        averageGrade: 1.2,
        taggs: ['historic', 'city', 'guided'],
        transportDurations: [],
        reviews: [],
        checkpoints: []
      }
    ];
  }

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next:(user) => {
        this.user = user
        this.tourService.getTour().subscribe({
          next:(tours: PagedResults<Tour>) => {
            //this.availableTours = tours.results.filter(tour => tour.authorId === this.user.id && tour.status == TourStatus.Published);
            if(this.data)
            {
              this.selectedTours = this.availableTours.filter(tour => this.selectedToursIds.includes(tour.id))
              this.availableTours = this.availableTours.filter(
                (tour) => !this.selectedTours.some((selected) => selected.id === tour.id))
            }
          }
        })
      }
    })
  }

  onSubmit(): void {
    this.dialogRef.close({
      name: this.bundleName,
      price: this.bundlePrice,
      tourIds: this.selectedToursIds,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  moveToSelected(tour: Tour, source: string) {
    if (source === 'available') {
      this.selectedTours.push(tour);
      this.availableTours = this.availableTours.filter(t => t.id !== tour.id);
      this.selectedToursIds.push(tour.id)
    } else {
      this.availableTours.push(tour);
      this.selectedTours = this.selectedTours.filter(t => t.id !== tour.id);
      this.selectedToursIds = this.selectedToursIds.filter(id => id !== tour.id);
    }
  }

}
