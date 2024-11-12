import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { RatingTheAppComponent } from './rating-the-app/rating-the-app.component';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    RatingTheAppComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    RatingTheAppComponent,
  ]
})
export class LayoutModule { }
