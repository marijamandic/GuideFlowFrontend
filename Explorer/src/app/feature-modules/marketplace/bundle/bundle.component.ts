import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { TourBundle } from '../model/tour-bundle.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ShoppingCartService } from '../shopping-cart.service';
import { environment } from 'src/env/environment';
import { convertEnumToString } from 'src/app/shared/utils/enumToStringConverter';
import { ItemInput } from '../model/shopping-carts/item-input';
import { ProductType } from '../model/product-type';
import { CartPreviewService } from '../../layout/cart-preview.service';

@Component({
	selector: 'xp-bundle',
	templateUrl: './bundle.component.html',
	styleUrls: ['./bundle.component.css']
})
export class BundleComponent implements OnInit {
	bundle: TourBundle;
	isOpened$: boolean;

	constructor(
		private location: Location,
		private marketplaceService: MarketplaceService,
		private shoppingCartService: ShoppingCartService,
		private cartPreviewService: CartPreviewService
	) {}

	ngOnInit(): void {
		this.getBundle();
	}

	private getBundle() {
		const navigation = this.location.getState() as { bundleId: number };
		this.marketplaceService.getBundleById(navigation.bundleId).subscribe({
			next: (bundle: TourBundle) => (this.bundle = { ...bundle, tourIds: [...bundle.tourIds], tours: [...bundle.tours!] }),
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	private subscribeCart() {
		this.cartPreviewService.isOpened$.subscribe(isOpened => (this.isOpened$ = isOpened));
	}

	getImageUrl(url: string) {
		return `${environment.webRootHost}${url}`;
	}

	addToCart() {
		const item = {
			type: ProductType.Bundle,
			productId: this.bundle.id,
			productName: this.bundle.name,
			adventureCoin: this.bundle.price
		} as ItemInput;

		this.shoppingCartService.addToCart(item).subscribe({
			next: () => this.cartPreviewService.open(),
			error: (error: HttpErrorResponse) => {
				if (error.status === 400) alert('Item already in cart');
				else console.log(error.message);
			}
		});
	}

	convertLevelEnumToString(value: number, type: string) {
		return convertEnumToString(value, type);
	}
}
