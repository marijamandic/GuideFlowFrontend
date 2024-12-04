import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../model/shopping-carts/item';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPurchaseToken } from '../model/purchase-tokens/tour-purchase-token';
import { Payment } from '../model/payments/payment';
import { Coupon } from '../model/coupon.model';
import { ProductType } from '../model/product-type';
import { ItemInput } from '../model/shopping-carts/item-input';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
	selector: 'xp-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	cart: ShoppingCart = {
		id: 0,
		touristId: 0,
		items: []
	};

	totalAdventureCoins = 0;
	couponCode = '';

	constructor(private marketplaceService: MarketplaceService, private tourService: TourService) {}

	calculateAc(items: Item[]): void {
		this.totalAdventureCoins = 0;
		items.forEach(i => {
			this.totalAdventureCoins += i.adventureCoin;
		});
	}

	handleRemoveClick(itemId: number): void {
		this.marketplaceService.removeFromCart(itemId).subscribe({
			next: (): void => {
				this.cart.items = [...this.cart.items.filter(i => i.id !== itemId)];
				this.calculateAc(this.cart.items);
			},
			error: (err: HttpErrorResponse): void => {
				console.log(err.message);
			}
		});
	}

	goToCheckout(): void {
		this.marketplaceService.pay().subscribe({
			next: (result: Payment ): void => {
				this.loadShoppingCart();
				alert('You have successfully purchased ' + result.paymentItems.length + ' tours, and you have received a token for each one!');
			},
			error: (err: HttpErrorResponse): void => {
				console.log(err.message);
			}
		});
	}

	loadShoppingCart() {
		this.marketplaceService.getShoppingCartByTouristId().subscribe({
			next: (result: ShoppingCart) => {
				this.cart = { ...result };
				this.calculateAc(this.cart.items);
			},
			error: (err: HttpErrorResponse) => {
				console.log(err.message);
			}
		});
	}

	applyCoupon(): void{
		this.marketplaceService.getCouponByCode(this.couponCode).subscribe({
			next: (coupon: Coupon) => {
				if(coupon.redeemed)
					return;
				
				if(coupon.tourId !== null){
					const item = this.cart.items.find(i => i.productId === coupon.tourId && i.type === ProductType.Tour);
					console.log(item);
					if(item !== undefined){
						console.log('applied');
						this.applyDiscountToItem(item, coupon);
						this.loadShoppingCart();
					}
				}else if(coupon.validForAllTours){
					this.fetchToursByAuthorId(coupon.authorId).then(authorTours => {
						console.log('Fetched tours for author:', authorTours);
						authorTours.forEach(tourId => {
							const item = this.cart.items.find(
							  i => i.productId === tourId && i.type === ProductType.Tour
							);
							if (item) {
							  this.applyDiscountToItem(item, coupon);
							  this.loadShoppingCart();
							}
						  });
					}).catch(error => {
						console.error('Error fetching tours for author:', error);
					});

				}
			}
		})
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
	  
		this.marketplaceService.removeFromCart(item.id).subscribe({
		  next: () => {
			console.log(`Item ${item.id} removed from cart.`);
			this.marketplaceService.addToCart(itemInput).subscribe({
			  next: (result: Item[]) => {
				console.log('Discount applied and item updated in cart:', result);
				this.loadShoppingCart();
				this.calculateAc(this.cart.items); 

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
	  
		if(!coupon.redeemed){
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
		const ToursItems = this.cart.items
		  .filter(i => i.type === ProductType.Tour)
		  .map(i => i.productId);
	  
		const tourRequests = ToursItems.map(id =>
		  this.tourService.getTourById(id).toPromise()
		);
	  
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
	  
	  
	ngOnInit(): void {
		this.loadShoppingCart();
	}
}
