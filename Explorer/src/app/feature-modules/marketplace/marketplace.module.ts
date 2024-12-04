import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TourPreviewComponent } from './tour-preview/tour-preview.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CouponComponent } from './coupon/coupon.component';
import { TourBundlePreviewComponent } from './tour-bundle-preview/tour-bundle-preview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourMoreDetailsComponent } from './tour-more-details/tour-more-details.component';

@NgModule({
  declarations: [
    TourPreviewComponent,
    ShoppingCartComponent,
    CouponComponent,
    TourBundlePreviewComponent,
    TourMoreDetailsComponent
  ],
  imports: [
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    TourPreviewComponent,
    ShoppingCartComponent,
    CouponComponent,
    TourMoreDetailsComponent
  ]
})
export class MarketplaceModule { }
