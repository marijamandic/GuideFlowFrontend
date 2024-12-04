import { Component, numberAttribute, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourService } from '../../tour-authoring/tour.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { combineLatest} from 'rxjs';
import { BundleStatus, TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourBundleDialogComponent } from '../tour-bundle-dialog/tour-bundle-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
               private marketPlace: MarketplaceService,private dialog: MatDialog) {

                this.publishedTourBundles = [
                  {
                    id: 1,
                    name: 'Tropical Escape',
                    price: 250,
                    status: BundleStatus.Published,
                    authorId: 101,
                    tourIds: [1, 2]
                  },
                  {
                    id: 2,
                    name: 'Historic Adventure 2',
                    price: 300,
                    status: BundleStatus.Published,
                    authorId: 101,
                    tourIds: [3, 4]
                  },
                  {
                    id: 3,
                    name: 'Historic Adventure 3',
                    price: 300,
                    status: BundleStatus.Published,
                    authorId: 101,
                    tourIds: [3, 4]
                  },
                  {
                    id: 4,
                    name: 'Historic Adventure 4',
                    price: 300,
                    status: BundleStatus.Published,
                    authorId: 101,
                    tourIds: [3, 4]
                  }
                  ,
                  {
                    id: 5,
                    name: 'Historic Adventure 5',
                    price: 300,
                    status: BundleStatus.Published,
                    authorId: 101,
                    tourIds: [3, 4]
                  }
                ];

                this.draftTourBundles = [ {
                  id: 2,
                  name: 'Historic Adventure 2',
                  price: 300,
                  status: BundleStatus.Draft,
                  authorId: 101,
                  tourIds: [3, 4]
                },
                {
                  id: 3,
                  name: 'Historic Adventure 3',
                  price: 300,
                  status: BundleStatus.Draft,
                  authorId: 101,
                  tourIds: [3, 4]
                }]
               }
               
               
  ngOnInit(): void {
    combineLatest([
          this.authService.user$,
          this.tourService.getTour()
          ]).subscribe({
            next: ([user, result]) => {
                  this.user = user;
                  this.authorTours = result.results.filter(tour => tour.authorId === user.id && tour.status == TourStatus.Published);
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
  


  publish(bundle: TourBundle): void{
    bundle.status = BundleStatus.Published
    this.draftTourBundles = this.draftTourBundles.filter( b => b.id != bundle.id)
    this.publishedTourBundles.push(bundle)
    this.marketPlace.publishTourBundle(bundle.id).subscribe()
  }

  archive(bundle: TourBundle): void {
    this.publishedTourBundles = this.publishedTourBundles.filter( b => b.id != bundle.id)
    bundle.status = BundleStatus.Archived
    this.archivedTourBundles.push(bundle)
    this.marketPlace.archiveTourBundle(bundle.id).subscribe()
  }

  delete(bundle: TourBundle): void {
    this.marketPlace.deleteTourBundle(bundle.id).subscribe()
    if(bundle.status == BundleStatus.Archived)
      this.archivedTourBundles = this.archivedTourBundles.filter(b => b.id != bundle.id)
    else if (bundle.status ==  BundleStatus.Draft)
      this.draftTourBundles = this.draftTourBundles.filter(b => b.id != bundle.id)
  }


  openAddBundleDialog(): void {
    const dialogRef = this.dialog.open(TourBundleDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newDraft = {
          id: 0,
          name: result.name,
          price: result.price,
          tourIds: result.selectedTours,
          authorId: 0,
          status: 0
        } as TourBundle
        this.draftTourBundles.push(newDraft)
        this.marketPlace.createTourBundle(newDraft).subscribe()
      }
    });
  }

  modifyDraft(bundle: TourBundle): void {
    const dialogRef = this.dialog.open(TourBundleDialogComponent, {
      data: bundle,  
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.draftTourBundles.findIndex(draft => draft.id === result.id);
      
      if (index !== -1)
        this.draftTourBundles[index] = result;
      this.marketPlace.modifyTourBundle(result).subscribe()
      }
    });
  }
}
