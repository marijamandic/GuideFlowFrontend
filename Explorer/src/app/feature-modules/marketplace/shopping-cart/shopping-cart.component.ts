import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Item } from '../model/shopping-carts/item';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPurchaseToken } from '../model/purchase-tokens/tour-purchase-token';
import { Payment } from '../model/payments/payment';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
	selector: 'xp-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	cart$: ShoppingCart;
	totalAdventureCoins: number;

	constructor(private shoppingCartService: ShoppingCartService, private marketplaceService: MarketplaceService) {}

	ngOnInit(): void {
		this.subscribeCart();
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
}
