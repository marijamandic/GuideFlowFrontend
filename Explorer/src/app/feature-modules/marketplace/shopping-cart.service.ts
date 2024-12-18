import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ShoppingCart } from './model/shopping-carts/shopping-cart';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import Headers from 'src/app/shared/utils/headers';
import { ItemInput } from './model/shopping-carts/item-input';
import { Item } from './model/shopping-carts/item';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
	providedIn: 'root'
})
export class ShoppingCartService {
	cart$ = new BehaviorSubject<ShoppingCart>({
		id: 0,
		touristId: 0,
		items: []
	});

	constructor(private http: HttpClient) {}

	getShoppingCartByTouristId(): Observable<ShoppingCart> {
		return this.http.get<ShoppingCart>(`${environment.apiHost}shopping-cart`, { headers: Headers }).pipe(
			tap(cart => {
				this.setCart(cart);
			})
		);
	}

	getPopulatedByTouristId(): Observable<ShoppingCart> {
		return this.http.get<ShoppingCart>(`${environment.apiHost}shopping-cart/populated`, { headers: Headers }).pipe(
			tap(cart => {
				this.setCart(cart);
			})
		);
	}

	addToCart(item: ItemInput): Observable<PagedResults<Item>> {
		return this.http.post<PagedResults<Item>>(`${environment.apiHost}shopping-cart/items`, item, { headers: Headers }).pipe(
			tap(items => {
				let oldCart = this.cart$.getValue();
				oldCart.items = items.results;
				this.setCart(oldCart);
			})
		);
	}

	removeFromCart(itemId: number): Observable<null> {
		return this.http.delete<null>(`${environment.apiHost}shopping-cart/items/${itemId}`, { headers: Headers }).pipe(
			tap(() => {
				let oldCart = this.cart$.getValue();
				oldCart.items = [...oldCart.items.filter(i => i.id !== itemId)];
				this.setCart(oldCart);
			})
		);
	}

	private setCart(cart: ShoppingCart): void {
		this.cart$.next({
			...cart,
			items: cart.items.map(i => ({ ...i }))
		});
	}
}
