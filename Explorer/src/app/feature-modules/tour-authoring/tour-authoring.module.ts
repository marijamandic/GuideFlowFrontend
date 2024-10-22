import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourObjectComponent } from './tour-object/tour-object.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourObjectFormComponent } from './tour-object-form/tour-object-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TourObjectComponent,
    TourObjectFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TourObjectComponent,
    TourObjectFormComponent
  ]
})
export class TourAuthoringModule { }
