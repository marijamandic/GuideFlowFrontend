import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ShoppingCart } from '../model/shopping-carts/shopping-cart';
import { ShoppingCartService } from '../shopping-cart.service';
import { Item } from '../model/shopping-carts/item';
import { Router } from '@angular/router';

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

	handleGoToCart() {
		this.shoppingCartOpened.emit();
		this.router.navigate(['/shoppingCart']);
	}
}
