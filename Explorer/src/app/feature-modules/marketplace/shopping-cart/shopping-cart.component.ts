import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SingleItem } from '../model/shopping-carts/single-item';

@Component({
	selector: 'xp-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	cart: ShoppingCart = {
		id: 0,
		touristId: 0,
		singleItems: []
	};

	totalAdventureCoins = 0;

	constructor(private marketplaceService: MarketplaceService) {}

	calculateAc(items: SingleItem[]): void {
		this.totalAdventureCoins = 0;
		items.forEach(i => {
			this.totalAdventureCoins += i.adventureCoin;
		});
	}

	handleRemoveClick(singleItemId: number): void {
		this.marketplaceService.removeFromCart(singleItemId).subscribe({
			next: (): void => {
				this.cart.singleItems = [...this.cart.singleItems.filter(i => i.id !== singleItemId)];
				this.calculateAc(this.cart.singleItems);
			},
			error: (err: HttpErrorResponse): void => {
				console.log(err.message);
			}
		});
	}

	ngOnInit(): void {
		this.marketplaceService.getShoppingCartByTouristId().subscribe({
			next: (result: ShoppingCart) => {
				this.cart = result;
				this.calculateAc(this.cart.singleItems);
			},
			error: (err: HttpErrorResponse) => {
				console.log(err.message);
			}
		});
	}
}
