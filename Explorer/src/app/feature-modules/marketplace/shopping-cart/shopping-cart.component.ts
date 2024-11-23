import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../model/shopping-carts/item';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPurchaseToken } from '../model/purchase-tokens/tour-purchase-token';
import { Payment } from '../model/payments/payment';

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

	constructor(private marketplaceService: MarketplaceService) {}

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

	ngOnInit(): void {
		this.loadShoppingCart();
	}
}
