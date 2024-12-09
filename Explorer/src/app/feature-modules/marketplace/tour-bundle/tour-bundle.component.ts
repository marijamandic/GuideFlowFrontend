import { Component, numberAttribute, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourService } from '../../tour-authoring/tour.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { BundleStatus, TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { TourBundleDialogComponent } from '../tour-bundle-dialog/tour-bundle-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'xp-tour-bundle',
  templateUrl: './tour-bundle.component.html',
  styleUrls: ['./tour-bundle.component.css']
})
export class TourBundleComponent implements OnInit{

  user: User
  draftTourBundles: TourBundle[] = []
  publishedTourBundles: TourBundle[] = []
  archivedTourBundles: TourBundle[] = []


  constructor(private authService: AuthService,
               private marketPlace: MarketplaceService,private dialog: MatDialog) { }
               
               
  ngOnInit(): void {
          this.authService.user$.subscribe({
            next: (user) => {
                  this.user = user;
                  this.getTourBundles(user.id)
      },
      error: (err) => {
        console.error('Error fetching user or tours:', err);
      }
    });
  }
  
  getTourBundles(userId: number) : void {
    this.marketPlace.getTourBundles(userId).subscribe({
      next: (result) => {
        const allBundles = result.results
        this.draftTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Draft);
        this.publishedTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Published);
        this.archivedTourBundles = allBundles.filter(bundle => bundle.status == BundleStatus.Archived);
      }
    })
  }

  publish(bundle: TourBundle): void{
    if(bundle.tourIds.length < 2 || bundle.price < 0) return
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
          tourIds: result.tourIds,
          authorId: 0,
          status: 0
        } as TourBundle
        console.log(result)
        this.draftTourBundles.push(newDraft)
        this.marketPlace.createTourBundle(newDraft).subscribe({
          next: () => {
            this.getTourBundles(this.user.id)
          }
       })
      }
    });
  }

  modifyDraft(bundle: TourBundle): void {
    const dialogRef = this.dialog.open(TourBundleDialogComponent, {
      data: bundle,  
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        bundle.name = result.name
        bundle.price = result.price
        bundle.tourIds = result.tourIds
        console.log(bundle)
        this.marketPlace.modifyTourBundle(bundle).subscribe()
      }
    });
  }
}
