import { Component, Input, OnInit } from '@angular/core';
import {  Level, Tour, TourStatus } from '../../tour-authoring/model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { MarkdownService } from 'ngx-markdown';
import { MarketplaceService } from '../marketplace.service';
import { Currency, OrderItem } from '../model/orderItem.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TransportType } from '../../tour-authoring/model/transportDuration.model';

@Component({
  selector: 'xp-tour-preview',
  templateUrl: './tour-preview.component.html',
  styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent implements OnInit {

  tourId: number 
  public currentTour: Tour 
  user: User
  public TransportType = TransportType

  constructor(private route: ActivatedRoute, private tourService: TourService,
              private marketService: MarketplaceService, private authService: AuthService)
    {}

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.user$.subscribe({
        next: (user: User) => {
            this.user = user
        }
    });
   this.getCurrentTour()
  }

  getCurrentTour(): void {
    this.tourService.getTourById(this.tourId).subscribe({
      next: (result: Tour) => {
        this.currentTour = result
        console.log(result)
      },
      error: (err) => {
        console.error('Tour with id' + this.tourId + ' not found:');
        
    }
    })
  }

  addToCart(): void {
        let orderItem : OrderItem = {
            tourID: this.currentTour?.id,
            tourName: this.currentTour.name,
            price: this.currentTour.price.cost,
            quantity: 1
        }
        this.marketService.addItemToCart(this.user.id, orderItem).subscribe({
            next: () => {
                console.log('Added to cart')
            },
            error: (err) => {
                console.error(err);
                
            }
            
        })
  }

}
