import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { BlogModule } from './feature-modules/blog/blog.module';
import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { TourAuthoringModule } from './feature-modules/tour-authoring/tour-authoring.module';
import { TourExecutionModule } from './feature-modules/tour-execution/tour-execution.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { HomeComponent } from './feature-modules/layout/home/home.component';
import { RatingTheAppComponent } from './feature-modules/layout/rating-the-app/rating-the-app.component';
import { FooterComponent } from './feature-modules/layout/footer/footer.component';

@NgModule({
	declarations: [
		AppComponent,

	],
		
	imports: [
		BrowserModule,
		AppRoutingModule,
		LayoutModule,
		BrowserAnimationsModule,
		MaterialModule,
		AdministrationModule,
		BlogModule,
		MarketplaceModule,
		TourAuthoringModule,
		TourExecutionModule,
		AuthModule,
		HttpClientModule,
		MatFormFieldModule,
		MatInputModule,
		LayoutModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
