import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PublicPointNotificationsComponent } from '../feature-modules/tour-authoring/public-point-notifications/public-point-notifications.component';
import { ShareModalComponent } from './share-modal/share-modal.component';

@NgModule({
	declarations: [
    MapComponent,
    PublicPointNotificationsComponent,
    ShareModalComponent
  ],
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ MapComponent, PublicPointNotificationsComponent, ShareModalComponent ]
})
export class SharedModule {}
