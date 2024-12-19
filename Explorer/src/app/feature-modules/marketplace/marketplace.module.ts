import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TourBundleComponent } from './tour-bundle/tour-bundle.component';
import { MatTabsModule } from '@angular/material/tabs';
import { TourBundleDialogComponent } from './tour-bundle-dialog/tour-bundle-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CouponComponent } from './coupon/coupon.component';
import { TourBundlePreviewComponent } from './tour-bundle-preview/tour-bundle-preview.component';
import { ShoppingCartPreviewComponent } from './shopping-cart-preview/shopping-cart-preview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourMoreDetailsComponent } from './tour-more-details/tour-more-details.component';
import { BundlesComponent } from './bundles/bundles.component';
import { BundleComponent } from './bundle/bundle.component';

@NgModule({
	declarations: [
		ShoppingCartComponent,
		TourBundleComponent,
		TourBundleDialogComponent,
		CouponComponent,
		TourBundlePreviewComponent,
		ShoppingCartPreviewComponent,
		TourMoreDetailsComponent,
		BundlesComponent,
  BundleComponent
	],
	imports: [
		MatRadioModule,
		MatFormFieldModule,
		MatInputModule,
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		MatTabsModule,
		FormsModule,
		SharedModule,
		MatDialogModule
	],
	exports: [TourPreviewComponent, ShoppingCartComponent, CouponComponent, ShoppingCartPreviewComponent, TourMoreDetailsComponent, BundlesComponent]
})
export class MarketplaceModule {}
