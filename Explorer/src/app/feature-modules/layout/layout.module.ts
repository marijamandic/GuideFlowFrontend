import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { RatingTheAppComponent } from './rating-the-app/rating-the-app.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component'; // <-- Import FormsModule
import { NotificationsComponent } from './notifications/notifications.component'; // <-- Import FormsModule
import { SharedModule } from 'src/app/shared/shared.module';
import { MarketplaceModule } from "../marketplace/marketplace.module";
import { CustomAlertComponent } from './custom-alert/custom-alert.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    RatingTheAppComponent,
    FooterComponent,
    NotificationsComponent,
    CustomAlertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    SharedModule,
    MarketplaceModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    RatingTheAppComponent,
    FooterComponent,
    NotificationsComponent,
    CustomAlertComponent
  ]
})
export class LayoutModule {}
