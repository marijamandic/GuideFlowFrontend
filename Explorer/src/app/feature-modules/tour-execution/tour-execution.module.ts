import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { TourViewComponent } from './tour-view/tour-view.component';
import { TourExecutionDetailsComponent } from './tour-execution-details/tour-execution-details.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourExecutionMap } from './tour-execution-map/tour-execution-map.component';
import { TourAuthoringModule } from '../tour-authoring/tour-authoring.module';
import { SuggestedToursComponent } from './suggested-tours/suggested-tours.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';
@NgModule({
	providers: [DatePipe],
	declarations: [
		EquipmentManagementComponent,
		EquipmentFormComponent,
		TourReviewComponent,
		TourReviewFormComponent,
		TourExecutionDetailsComponent,
		PurchasedToursComponent,
		TourViewComponent,
		TourExecutionMap,
		SuggestedToursComponent
	],
	imports: [
		CommonModule,
		MatFormFieldModule,
		SharedModule,
		MatInputModule,
		ReactiveFormsModule,
		MatIconModule,
		CommonModule,
		FormsModule,
		TourAuthoringModule,
		MarketplaceModule
	],
	exports: [EquipmentManagementComponent, TourReviewComponent]
})
export class TourExecutionModule {}
