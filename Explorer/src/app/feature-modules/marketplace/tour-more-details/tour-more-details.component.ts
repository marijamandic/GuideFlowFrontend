import { Component, EventEmitter, Input, numberAttribute, OnInit, Output } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Level, Tour } from '../../tour-authoring/model/tour.model';
import { Checkpoint } from '../../tour-authoring/model/tourCheckpoint.model';
import { TourReview } from '../../tour-authoring/model/tourReview';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { environment } from 'src/env/environment';
import { Currency, Price } from '../../tour-authoring/model/price.model';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { ProductType } from '../model/product-type';
import { ItemInput } from '../model/shopping-carts/item-input';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'xp-tour-more-details',
  templateUrl: './tour-more-details.component.html',
  styleUrls: ['./tour-more-details.component.css']
})
export class TourMoreDetailsComponent implements OnInit{
  user : User
  tourId : number | null;
  tour: Tour;
  checkpoints: Checkpoint[] = [];
  reviews:TourReview[];
  checkpointCoordinates: { latitude: number; longitude: number; name: string; description: string; imageUrl?: string; }[] = [];
  @Input() forUpdating : boolean;
  @Output() checkpointsLoaded = new EventEmitter<{ latitude: number; longitude: number; name: string; description: string; imageUrl?: string; }[]>();
  MapViewMode:boolean = false;
  isPurchased:boolean = false;
  
  constructor(private authService: AuthService,private route: ActivatedRoute,private tourService:TourService,private marketService: MarketplaceService,private shoppingCartService:ShoppingCartService,private router: Router){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.checkIfPurchased();
    this.loadTour();
  }

  loadTour():void {
    if(this.tourId != null){
      this.tourService.getTourById(this.tourId).subscribe({
        next: (result) => {
          this.tour = result; 
          if(!this.isPurchased){
            this.checkpoints.push(this.tour.checkpoints[0]);
          }else{
            this.checkpoints = this.tour.checkpoints;
          }
          this.reviews = this.tour.reviews;
          this.reviews = this.tour.reviews.map((review) => ({
            ...review,
            creationDate: review.creationDate 
              ? (review.creationDate instanceof Date ? review.creationDate : new Date(review.creationDate))
              : new Date(),
          }));
          this.tour.averageGrade = this.getAverageGrade();
        this.checkpointCoordinates = this.checkpoints.map(cp => ({
          latitude: cp.latitude,
          longitude: cp.longitude,
          name: cp.name,
          description: cp.description,
          imageUrl: this.getImagePath(cp.imageUrl)
        }));
          this.checkpointsLoaded.emit(this.checkpointCoordinates);
        },
        error: (err) => {
          console.error('Greška prilikom učitavanja checkpoint-a:', err);
        }
      });
    }
  }

  checkIfPurchased() {
    if(this.tourId !== null){
      this.marketService.checkIfPurchased(this.tourId).subscribe({
        next:(result) => {
          this.isPurchased = true;
        },
        error:(err) =>{
          console.error('This tourist has not bought this tour!');
        }
      })
    }
  }

  getImagePath(imageUrl: string | undefined){
    if(imageUrl!==undefined){
      return environment.webRootHost+imageUrl;
    }
    return "";
  }

  getLevel(level: Level): string {
    switch (level) {
      case Level.Easy:
        return 'Easy';
      case Level.Advanced:
        return 'Advanced';
      case Level.Expert:
        return 'Expert';
      default:
        return 'Unknown';
    }
  }
  
  getFormattedPrice(price: Price): string {
    if (!price) return '';
    switch (price.currency) {
      case Currency.RSD:
        return `${price.cost} RSD`;
      case Currency.EUR:
        return `${price.cost} €`;
      case Currency.USD:
        return `${price.cost} $`;
      default:
        return `${price.cost}`;
    }
  }
  
  getStars(): string[] {
    if (!this.tour || !this.tour.averageGrade) return [];
  
    const fullStars = Math.floor(this.tour.averageGrade);
    const hasHalfStar = this.tour.averageGrade % 1 >= 0.5;
    const totalStars = fullStars + (hasHalfStar ? 1 : 0);

    const stars = Array(5).fill('empty'); 
    stars.fill('full', 0, fullStars); 
    if (hasHalfStar && fullStars < 5) {
      stars[fullStars] = 'half';
    }
  
    return stars;
  }
  
  getStarsFromRating(rating: number | undefined): string[] {
    if (!rating) return [];
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
  
    return [
      ...Array(fullStars).fill('full'),
      ...(hasHalfStar ? ['half'] : []),
      ...Array(emptyStars).fill('empty'),
    ];
  }

  getAverageGrade(): number {
    if (this.tour !== null && this.reviews.length > 0) {
      let sumGrade = 0;
      this.reviews.forEach(review => {
        if(review.rating !== undefined)
          sumGrade += review.rating;
      });
      return sumGrade / this.reviews.length;
    }
    return 0;
  }

  addToCart(): void {
		let item: ItemInput = {
			type: ProductType.Tour,
			productId: this.tourId!,
			productName: this.tour.name,
			adventureCoin: this.tour.price.cost
		};
		this.shoppingCartService.addToCart(item).subscribe({
      next: () =>{
        alert('Tour is added to your cart!');
      },
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}
  navigateToProfile(authorId : number){
    this.router.navigate(["profile",authorId])
  }
}