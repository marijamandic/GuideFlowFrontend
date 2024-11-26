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
import { TourBundleComponent } from './tour-bundle/tour-bundle.component';
import { MatTabsModule } from '@angular/material/tabs'

@NgModule({
  declarations: [
    TourSpecificationComponent,
    TourSpecificationFormComponent,
    TourPreviewComponent,
    ShoppingCartComponent,
    TourBundleComponent
  ],
  imports: [
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  exports: [
    TourSpecificationComponent,
    TourSpecificationFormComponent,
    TourPreviewComponent,
    ShoppingCartComponent
  ]
})
export class MarketplaceModule { }
