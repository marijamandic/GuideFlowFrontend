import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';
import { PublicPointNotificationsComponent } from '../feature-modules/tour-authoring/public-point-notifications/public-point-notifications.component';

@NgModule({
	declarations: [
    MapComponent,
    PublicPointNotificationsComponent
  ],
	imports: [CommonModule, FormsModule],
  exports: [ MapComponent, PublicPointNotificationsComponent ]
})
export class SharedModule {}
