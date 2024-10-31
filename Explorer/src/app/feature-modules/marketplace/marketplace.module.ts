import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourSpecificationFormComponent } from '../marketplace/tour-specification-form/tour-specification-form.component';
import { TourSpecificationComponent } from '../marketplace/tour-specification/tour-specification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    TourSpecificationComponent,
    TourSpecificationFormComponent
  ],
  imports: [
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TourSpecificationComponent,
    TourSpecificationFormComponent
  ]
})
export class MarketplaceModule { }
