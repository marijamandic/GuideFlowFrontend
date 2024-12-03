import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TourPreviewComponent } from './tour-preview/tour-preview.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TourBundlePreviewComponent } from './tour-bundle-preview/tour-bundle-preview.component';

@NgModule({
  declarations: [
    TourPreviewComponent,
    ShoppingCartComponent,
    TourBundlePreviewComponent
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
    TourPreviewComponent,
    ShoppingCartComponent
  ]
})
export class MarketplaceModule { }
