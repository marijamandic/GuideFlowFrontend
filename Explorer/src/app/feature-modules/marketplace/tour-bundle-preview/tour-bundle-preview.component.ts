import { Component, OnInit } from '@angular/core';
import { Level, Tour } from '../../tour-authoring/model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourBundle } from '../model/tour-bundle.model';
import { ItemInput } from '../model/shopping-carts/item-input';
import { ProductType } from '../model/product-type';
import { Item } from '../model/shopping-carts/item';
import { HttpErrorResponse } from '@angular/common/http';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Currency, Price } from '../../tour-authoring/model/price.model';

@Component({
  selector: 'xp-tour-bundle-preview',
  templateUrl: './tour-bundle-preview.component.html',
  styleUrls: ['./tour-bundle-preview.component.css']
})
export class TourBundlePreviewComponent implements OnInit{
  bundleId: number;
  bundle: TourBundle;
  tours: Tour[];
	user: User;

	constructor(
		private route: ActivatedRoute,
		private tourService: TourService,
		private marketService: MarketplaceService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.bundleId = Number(this.route.snapshot.paramMap.get('id'));
    	this.getBundle();

		this.authService.user$.subscribe({
			next: (user: User) => {
				this.user = user;
			}
		});
	}

	getBundle():void{
		if(this.bundleId !== undefined && this.bundleId !== null){
			this.marketService.getBundleById(this.bundleId).subscribe({
				next: (result: TourBundle) => {
					this.bundle = result;
					this.getBundleTours();
				}
			});
		}
	}

	getBundleTours(): void {
		if(this.bundleId !== undefined && this.bundleId !== null){
		this.tourService.getToursByBundleId(this.bundleId).subscribe({
			next: (result: PagedResults<Tour>) => {
			this.tours=result.results;
			}
		});
		}
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
	  
	  

	addToCart(): void {
		let item: ItemInput = {
			type: ProductType.Bundle,
			productId: this.bundleId!,
			productName: this.bundle.name,
			adventureCoin: this.bundle.price
		};
		this.marketService.addToCart(item).subscribe({
			next: (result: Item[]): void => {
				alert('Added To Cart');
			},
			error: (err: HttpErrorResponse): void => {
				console.log('Error: ', err);
			}
		});
	}
}
