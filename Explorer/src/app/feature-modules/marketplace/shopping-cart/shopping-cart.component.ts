import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../model/shopping-carts/item';
import { Payment } from '../model/payments/payment';
import { Coupon } from '../model/coupon.model';
import { ProductType } from '../model/product-type';
import { ItemInput } from '../model/shopping-carts/item-input';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourBundle } from '../model/tour-bundle.model';
import { ShoppingCartService } from '../shopping-cart.service';
import { convertEnumToString } from 'src/app/shared/utils/enumToStringConverter';
import { TourDetails } from '../model/shopping-carts/tour-details';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';

@Component({
	selector: 'xp-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	cart$: ShoppingCart;
	totalAdventureCoins: number;
	couponCode = '';
	showTours = true;

	constructor(private shoppingCartService: ShoppingCartService, private marketplaceService: MarketplaceService, private tourService: TourService) {}

	ngOnInit(): void {
		this.subscribeCart();
		this.fetchPopulatedCart();
	}

	private subscribeCart() {
		this.shoppingCartService.cart$.subscribe(cart => {
			this.cart$ = cart;
			this.calculateAc(this.cart$.items);
		});
	}

	private calculateAc(items: Item[]): void {
		this.totalAdventureCoins = 0;
		items.forEach(i => {
			this.totalAdventureCoins += i.adventureCoin;
		});
	}

	private fetchPopulatedCart() {
		this.shoppingCartService.getPopulatedByTouristId().subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	handleRemoveClick(itemId: number): void {
		this.shoppingCartService.removeFromCart(itemId).subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	goToCheckout(): void {
		this.marketplaceService.pay().subscribe({
			next: (result: Payment): void => {
				this.shoppingCartService.getShoppingCartByTouristId().subscribe({
					error: (error: HttpErrorResponse) => console.log(error.message)
				});
				alert('You have successfully purchased ' + result.paymentItems.length + ' tours, and you have received a token for each one!');
			},
			error: (err: HttpErrorResponse): void => {
				console.log(err.message);
			}
		});
	}

	loadShoppingCart() {
		this.shoppingCartService.getShoppingCartByTouristId().subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	applyCoupon(): void {
		this.marketplaceService.getCouponByCode(this.couponCode).subscribe({
			next: (coupon: Coupon) => {
				if (coupon.redeemed) return;

				if (coupon.tourId !== null) {
					const item = this.cart$.items.find(i => i.productId === coupon.tourId && i.type === ProductType.Tour);
					console.log(item);
					if (item !== undefined) {
						console.log('applied');
						this.applyDiscountToItem(item, coupon);
						this.loadShoppingCart();
					}
				} else if (coupon.validForAllTours) {
					this.fetchToursByAuthorId(coupon.authorId)
						.then(authorTours => {
							console.log('Fetched tours for author:', authorTours);
							authorTours.forEach(tourId => {
								const item = this.cart$.items.find(i => i.productId === tourId && i.type === ProductType.Tour);
								if (item) {
									this.applyDiscountToItem(item, coupon);
									this.loadShoppingCart();
								}
							});
						})
						.catch(error => {
							console.error('Error fetching tours for author:', error);
						});

					this.fetchBundlesByAuthorId(coupon.authorId)
						.then(authorBundles => {
							console.log('Fetched bundles for author:', authorBundles);

							authorBundles.forEach(bundleId => {
								const item = this.cart$.items.find(i => i.productId === bundleId && i.type === ProductType.Bundle);
								if (item) {
									this.applyDiscountToItem(item, coupon);
								}
							});

							this.loadShoppingCart();
						})
						.catch(error => {
							console.error('Error fetching bundles for author:', error);
						});
				}
				this.couponCode = '';
			}
		});
	}

	applyDiscountToItem(item: Item, coupon: Coupon): void {
		console.log('Applying discount to item:', item);

		const discountAmount = (item.adventureCoin * coupon.discount) / 100;
		const updatedAdventureCoin = Math.round(item.adventureCoin - discountAmount);

		const itemInput: ItemInput = {
			type: item.type,
			productId: item.productId || 0,
			productName: item.productName || '',
			adventureCoin: updatedAdventureCoin
		};

		console.log('ItemInput after discount:', itemInput);

		this.shoppingCartService.removeFromCart(item.id).subscribe({
			next: () => {
				console.log(`Item ${item.id} removed from cart.`);
				this.shoppingCartService.addToCart(itemInput).subscribe({
					next: () => {
						this.loadShoppingCart();
						console.log('Discount applied and item updated in cart:', this.cart$.items);
						this.calculateAc(this.cart$.items);
					},
					error: (err: HttpErrorResponse) => {
						console.error('Error adding updated item to cart:', err);
					}
				});
			},
			error: (err: HttpErrorResponse) => {
				console.error('Error removing item from cart:', err);
			}
		});

		if (!coupon.redeemed) {
			this.marketplaceService.redeemCoupon(coupon.code).subscribe({
				next: () => {
					console.log('Coupon redeemed successfully.');
				},
				error: (err: HttpErrorResponse) => {
					console.error('Error redeeming coupon:', err);
				}
			});
		}
	}

	fetchToursByAuthorId(authorId: number): Promise<any[]> {
		const ToursItems = this.cart$.items.filter(i => i.type === ProductType.Tour).map(i => i.productId);

		const tourRequests = ToursItems.map(id => this.tourService.getTourById(id).toPromise());

		return Promise.all(tourRequests)
			.then(tours => {
				const definedTours = tours.filter((tour): tour is Tour => tour !== undefined && tour !== null);
				const authorTours = definedTours.filter(tour => tour.authorId === authorId).map(tour => tour.id);
				console.log('Fetched tours for author:', authorTours);
				return authorTours;
			})
			.catch(error => {
				console.error('Error fetching tours:', error);
				return [];
			});
	}

	fetchBundlesByAuthorId(authorId: number): Promise<any[]> {
		const BundleItems = this.cart$.items
			.filter(i => i.type === ProductType.Bundle) // Filter cart items of type Bundle
			.map(i => i.productId); // Extract their product IDs

		// Make requests to fetch each bundle by its ID
		const bundleRequests = BundleItems.map(id => this.marketplaceService.getBundleById(id).toPromise());

		return Promise.all(bundleRequests)
			.then(bundles => {
				// Exclude undefined or null bundles
				const definedBundles = bundles.filter((bundle): bundle is TourBundle => bundle !== undefined && bundle !== null);

				// Filter bundles by authorId and return their IDs
				const authorBundles = definedBundles.filter(bundle => bundle.authorId === authorId).map(bundle => bundle.id);

				console.log('Fetched bundles for author:', authorBundles);
				return authorBundles; // Return the IDs of the bundles
			})
			.catch(error => {
				console.error('Error fetching bundles:', error);
				return []; // Return an empty array in case of an error
			});
	}

	convertLevelEnumToString(value: number, type: string): string {
		return convertEnumToString(value, type);
	}

	isTour(product: TourDetails | TourBundle): product is TourDetails {
		return 'level' in product;
	}

	isBundle(product: TourDetails | TourBundle): product is TourBundle {
		return 'tourIds' in product;
	}

	getImageUrl(imageUrl: string): string {
		return `${environment.webRootHost}${imageUrl}`;
	}
}
