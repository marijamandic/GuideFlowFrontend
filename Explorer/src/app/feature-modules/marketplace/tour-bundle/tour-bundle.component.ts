import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourService } from '../../tour-authoring/tour.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { combineLatest, min} from 'rxjs';
import { BundleStatus, TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


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
  currentDraft: TourBundle = {
    tourIds: [],
    price: 0,
    name: '',
    status: BundleStatus.Draft,
    authorId: 0,
    id: 0
  }
  tourBundleForm: FormGroup



  constructor(private authService: AuthService, private tourService: TourService,
               private marketPlace: MarketplaceService) {

                this.tourBundleForm = new FormGroup({
                  name: new FormControl('' , [Validators.required]), 
                  price: new FormControl('', [Validators.min(1)]), 
                  tours: new FormControl([], []), 
                });

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
                  this.currentDraft.authorId = user.id
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
  
  
  onTourSelectChange(event: Event, tourId: number): void {
    const target = event.target as HTMLInputElement
    if(target.checked)
      this.currentDraft.tourIds.push(tourId)
    else
      this.currentDraft.tourIds = this.currentDraft.tourIds.filter(id => id != tourId)
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

  create(): void{
    this.currentDraft = this.tourBundleForm.value
    this.draftTourBundles.push({...this.currentDraft})
    this.marketPlace.createTourBundle(this.currentDraft).subscribe()
    this.tourBundleForm.reset({});
  }
}
