import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../model/shopping-carts/item';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { CartPreviewService } from '../../layout/cart-preview.service';

@Component({
	selector: 'xp-shopping-cart-preview',
	templateUrl: './shopping-cart-preview.component.html',
	styleUrls: ['./shopping-cart-preview.component.css']
})
export class ShoppingCartPreviewComponent implements OnInit {
	cart$: ShoppingCart;
	isOpened$: boolean;
	totalAdventureCoins: number;

	constructor(private shoppingCartService: ShoppingCartService, private router: Router, private cartPreviewService: CartPreviewService) {}

	ngOnInit(): void {
		this.subscribeCart();
		this.subscribeCartPreview();
	}

	private subscribeCartPreview() {
		this.cartPreviewService.isOpened$.subscribe(isOpened => (this.isOpened$ = isOpened));
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

	handleGoToCart(): void {
		this.cartPreviewService.close();
		this.router.navigate(['/shoppingCart']);
	}

	handleRemoveFromCart(itemId: number): void {
		this.shoppingCartService.removeFromCart(itemId).subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	getImageUrl(imageUrl: string) {
		return `${environment.webRootHost}${imageUrl}`;
	}
}
