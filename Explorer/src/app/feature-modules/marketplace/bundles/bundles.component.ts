import { Component, Input, OnInit } from '@angular/core';
import { TourBundle } from '../model/tour-bundle.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { ItemInput } from '../model/shopping-carts/item-input';
import { ProductType } from '../model/product-type';
import { ShoppingCartService } from '../shopping-cart.service';
import { CartPreviewService } from '../../layout/cart-preview.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'xp-bundles',
	templateUrl: './bundles.component.html',
	styleUrls: ['./bundles.component.css']
})
export class BundlesComponent implements OnInit {
	@Input() user: User;
	@Input() bundles: TourBundle[];

	isOpened$: boolean;

	constructor(private router: Router, private shoppingCartService: ShoppingCartService, private cartPreviewService: CartPreviewService) {}

	ngOnInit(): void {
		this.subscribeCartPreview();
	}

	private subscribeCartPreview() {
		this.cartPreviewService.isOpened$.subscribe(isOpened => (this.isOpened$ = isOpened));
	}

	getImageUrl(imageUrl: string): string {
		return `${environment.webRootHost}${imageUrl}`;
	}

	handleBundleDblClick(id: number) {
		this.router.navigate(['bundle'], { state: { bundleId: id } });
	}

	handleAddToCart(bundle: TourBundle) {
		let item = {
			type: ProductType.Bundle,
			productId: bundle.id,
			productName: bundle.name,
			adventureCoin: bundle.price
		} as ItemInput;

		this.shoppingCartService.addToCart(item).subscribe({
			next: () => this.cartPreviewService.open(),
			error: (error: HttpErrorResponse) => {
				if (error.status === 400) alert('Item already in cart');
				else console.log(error.message);
			}
		});
	}
}
