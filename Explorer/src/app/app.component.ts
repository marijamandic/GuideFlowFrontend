import { Component, OnInit } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import { ShoppingCartService } from './feature-modules/marketplace/shopping-cart.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'Explorer';

	constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService) {}

	ngOnInit(): void {
		this.checkIfUserExists();
		this.getCart();
	}

	private checkIfUserExists(): void {
		this.authService.checkIfUserExists();
	}

	private getCart() {
		this.shoppingCartService.getShoppingCartByTouristId().subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}
}
