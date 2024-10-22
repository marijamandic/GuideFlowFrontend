import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
    MapComponent
  ],
	imports: [CommonModule, FormsModule],
  exports: [ MapComponent ]
})
export class SharedModule {}
