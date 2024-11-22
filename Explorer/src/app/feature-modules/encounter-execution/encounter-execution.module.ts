import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterComponent } from './encounter/encounter.component';
import { SharedModule } from "../../shared/shared.module";
import { EncounterFormComponent } from './encounter-form/encounter-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { AdministrationModule } from '../administration/administration.module';

@NgModule({
  declarations: [
    EncounterComponent,
    EncounterFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AdministrationModule,
    FormsModule,
    SharedModule
  ]
})
export class EncounterExecutionModule { }
