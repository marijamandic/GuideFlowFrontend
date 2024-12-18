import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../model/shopping-carts/item';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/env/environment';

@Component({
	selector: 'xp-shopping-cart-preview',
	templateUrl: './shopping-cart-preview.component.html',
	styleUrls: ['./shopping-cart-preview.component.css']
})
export class ShoppingCartPreviewComponent implements OnInit {
	cart$: ShoppingCart;
	totalAdventureCoins: number;

	@Output() shoppingCartOpened = new EventEmitter<null>();

	constructor(private shoppingCartService: ShoppingCartService, private router: Router) {}

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

	handleGoToCart(): void {
		this.shoppingCartOpened.emit();
		this.router.navigate(['/shoppingCart']);
	}

	handleRemoveFromCart(itemId: number): void {
		this.shoppingCartService.removeFromCart(itemId).subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	getImageUrl(imageUrl: string) {
		console.log(`${environment.webRootHost}images/checkpoints/${imageUrl}`);
		return `${environment.webRootHost}images/checkpoints/${imageUrl}`;
	}
}
