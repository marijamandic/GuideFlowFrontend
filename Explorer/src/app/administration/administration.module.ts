import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentComponent } from './equipment/equipment.component';
import { ProfileInfoComponent } from '../feature-modules/administration/profile-info/profile-info.component';
import { HomeComponent } from '../layout/home/home.component';

@NgModule({
  declarations: [
    EquipmentComponent,
    HomeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AdministrationModule { }
