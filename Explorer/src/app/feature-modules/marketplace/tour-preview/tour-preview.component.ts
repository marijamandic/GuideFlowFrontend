import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Level, Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { Price, Currency } from '../../tour-authoring/model/price.model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ItemInput } from '../model/shopping-carts/item-input';
import { Item } from '../model/shopping-carts/item';
import { ProductType } from '../model/product-type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'xp-tour-preview',
	templateUrl: './tour-preview.component.html',
	styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent implements OnInit {
	tourId: number;
	currentTour: Tour;
	user: User;
	isPurchased: boolean = false;
	isArchived: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private tourService: TourService,
		private marketService: MarketplaceService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef
	) {
		this.currentTour = {
			id: 0,
			authorId: 0,
			name: '',
			description: '',
			price: {
				cost: 0,
				currency: Currency.RSD
			},
			level: Level.Easy,
			status: TourStatus.Published,
			lengthInKm: 0,
			averageGrade: 0,
			taggs: [],
			checkpoints: [],
			reviews: [],
			transportDurations: []
		};
	}

	ngOnInit(): void {
		this.tourId = Number(this.route.snapshot.paramMap.get('id'));

		this.authService.user$.subscribe({
			next: (user: User) => {
				this.user = user;

				this.getToken(this.user.id, this.tourId)
					.then(isPurchased => {
						this.isPurchased = isPurchased;

						this.cdr.detectChanges();

						this.getCurrentTour();
					})
					.catch(() => {
						this.isPurchased = false;

						this.cdr.detectChanges();

						this.getCurrentTour();
					});
			}
		});
	}

	getCurrentTour(): void {
		this.tourService.getTourById(this.tourId).subscribe({
			next: (result: Tour) => {
				this.currentTour = result;
				this.isArchived = this.currentTour.status === TourStatus.Archived;
			}
		});
	}

	getToken(userId: number, tourId: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.marketService.checkToken(userId, tourId).subscribe({
				next: tour => {
					if (tour !== null) {
						resolve(true);
					} else {
						resolve(false);
					}
				},
				error: () => {
					reject(false);
				}
			});
		});
	}

	addToCart(): void {
		let item: ItemInput = {
			type: ProductType.Tour,
			productId: this.currentTour.id!,
			productName: this.currentTour.name,
			adventureCoin: 20
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

	activateTour(): void {
		alert('Tour Activated');
	}
}
