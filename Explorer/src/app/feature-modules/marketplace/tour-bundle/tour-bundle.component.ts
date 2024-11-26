import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourService } from '../../tour-authoring/tour.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { combineLatest } from 'rxjs';
import { BundleStatus, TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';


@Component({
  selector: 'xp-tour-bundle',
  templateUrl: './tour-bundle.component.html',
  styleUrls: ['./tour-bundle.component.css']
})
export class TourBundleComponent implements OnInit{

  user: User
  authorTours: Tour[] = []
  draftTourBundles: TourBundle[] = []
  publishedTourBundles: TourBundle[] = []
  archivedTourBundles: TourBundle[] = []
  

  constructor(private authService: AuthService, private tourService: TourService,
               private marketPlace: MarketplaceService) {}


  ngOnInit(): void {
    combineLatest([
      this.authService.user$,
      this.tourService.getTour()
    ]).subscribe({
      next: ([user, result]) => {
        this.user = user;
        this.authorTours = result.results.filter(tour => tour.authorId === user.id);
        this.marketPlace.getTourBundles(user.id).subscribe({
          next: (result) => {
            const allBundles = result.results
            this.draftTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Draft);
            this.publishedTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Published);
            this.archivedTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Archived);
          }
        })

      },
      error: (err) => {
        console.error('Error fetching user or tours:', err);
      }
    });
  }
}
