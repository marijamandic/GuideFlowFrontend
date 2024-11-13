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
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';
import { EquipmentComponent } from '../administration/equipment/equipment.component';
import { AdministrationModule } from '../administration/administration.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublicPointRequestsComponent } from './public-point-requests/public-point-requests.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    TourObjectComponent,
    TourObjectFormComponent,
    CheckpointListComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent,
    TourEquipmentComponent,
    PublicPointRequestsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AdministrationModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    TourObjectComponent,
    CheckpointListComponent,
    TourComponent,
    TourFormComponent,
    TourObjectFormComponent,
    TourEquipmentComponent,
    PublicPointRequestsComponent,
  ]
})
export class TourAuthoringModule {}
