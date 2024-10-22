import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourObjectComponent } from './tour-object/tour-object.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourObjectFormComponent } from './tour-object-form/tour-object-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckpointListComponent } from './tour-checkpoint/tour-checkpoint.component';
import { CheckpointFormComponent } from './tour-checkpoint-form/tour-checkpoint-form.component'; // Dodaj CheckpointFormComponent
import { TourComponent } from './tour/tour.component';
import { TourFormComponent } from './tour-form/tour-form.component';



@NgModule({
  declarations: [
    TourObjectComponent,
    TourObjectFormComponent,
    CheckpointListComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TourObjectComponent,
    CheckpointListComponent,
    TourComponent,
    TourFormComponent,
    TourObjectFormComponent
  ]
})
export class TourAuthoringModule {}
