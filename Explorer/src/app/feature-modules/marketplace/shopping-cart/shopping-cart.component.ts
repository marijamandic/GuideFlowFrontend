import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'xp-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	cart: ShoppingCart;

	constructor(private marketplaceService: MarketplaceService) {}

	calculateTotalPrice(): number {
		let price = 0;
		for (let item of this.cart.singleItems) price += item.price;
		return price;
	}

	ngOnInit(): void {
		this.marketplaceService.getShoppingCartByTouristId().subscribe({
			next: (result: ShoppingCart) => {
				this.cart = result;
			},
			error: (err: HttpErrorResponse) => {
				console.log(err.message);
			}
		});
	}
}
