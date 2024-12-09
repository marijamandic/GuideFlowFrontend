import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { ShoppingCartService } from 'src/app/feature-modules/marketplace/shopping-cart.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from '../jwt/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'xp-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	constructor(
		private authService: AuthService,
		private router: Router,
		private shoppingCartService: ShoppingCartService,
		private tokenStorage: TokenStorage
	) {}

	loginForm = new FormGroup({
		username: new FormControl('', [Validators.required]),
		password: new FormControl('', [Validators.required])
	});

	login(): void {
		const login: Login = {
			username: this.loginForm.value.username || '',
			password: this.loginForm.value.password || ''
		};

		if (this.loginForm.valid) {
			this.authService.login(login).subscribe({
				next: () => {
					this.router.navigate(['/']);
				}
			});
		}
	}

	private setCart() {
		const jwtHelperService = new JwtHelperService();
		const accessToken = this.tokenStorage.getAccessToken() || '';
		const role = jwtHelperService.decodeToken(accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

		if (role !== 'tourist') return;
		this.shoppingCartService.getShoppingCartByTouristId().subscribe({
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}
}
