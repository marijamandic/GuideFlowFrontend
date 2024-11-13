import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { RatingTheAppComponent } from './rating-the-app/rating-the-app.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component'; // <-- Import FormsModule

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    RatingTheAppComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    RatingTheAppComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
