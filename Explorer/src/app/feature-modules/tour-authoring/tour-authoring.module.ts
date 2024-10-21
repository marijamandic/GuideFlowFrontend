import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module'; // putanja do MaterialModule
import { ReactiveFormsModule } from '@angular/forms';
import { CheckpointListComponent } from './tour-checkpoint/tour-checkpoint.component';
import { CheckpointFormComponent } from './tour-checkpoint-form/tour-checkpoint-form.component'; // Dodaj CheckpointFormComponent

@NgModule({
  declarations: [
    CheckpointListComponent,
    CheckpointFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CheckpointListComponent 
  ]
})
export class TourAuthoringModule {}
