import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourSpecificationFormComponent } from '../marketplace/tour-specification-form/tour-specification-form.component';
import { TourSpecificationComponent } from '../marketplace/tour-specification/tour-specification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TourPreviewComponent } from './tour-preview/tour-preview.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CouponComponent } from './coupon/coupon.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TourSpecificationComponent,
    TourSpecificationFormComponent,
    TourPreviewComponent,
    ShoppingCartComponent,
    CouponComponent
  ],
  imports: [
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    TourSpecificationComponent,
    TourSpecificationFormComponent,
    TourPreviewComponent,
    ShoppingCartComponent,
    CouponComponent
  ]
})
export class MarketplaceModule { }
