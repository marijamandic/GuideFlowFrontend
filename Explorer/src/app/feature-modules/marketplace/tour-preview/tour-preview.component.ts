import { Component, Input, OnInit } from '@angular/core';
import { Currency, Level, Tour, TourStatus, TransportType } from '../../tour-authoring/model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../tour-authoring/tour.service';
import { MarkdownService } from 'ngx-markdown';
import { MarketplaceService } from '../marketplace.service';
import { OrderItem } from '../model/orderItem.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-preview',
  templateUrl: './tour-preview.component.html',
  styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent implements OnInit {

  tourId: number 
  public currentTour: Tour
  user: User

  constructor(private route: ActivatedRoute, private tourService: TourService,
              private marketService: MarketplaceService, private authService: AuthService)
    {
    this.currentTour = {
      id: 1,
      authorId: 101,
      name: "Historical City Tour",
      description: "A guided tour exploring the rich history of the city, visiting ancient landmarks and hidden gems.",
      price: {
          cost: 1500,
          currency: Currency.RSD
      },
      level: Level.Easy,
      status: TourStatus.Published,
      lengthInKm: 10,
      averageGrade: 4.5,
      taggs: ["history", "culture", "landmarks"],
      checkpoints: [
        {   id: 1,
            name: 'Huston',
            description: 'Stunning watergate city like Venice',
            latitude: 111,
            longitude: 111,
            imageUrl: 'https://unobtainium13.com/wp-content/uploads/2020/10/cheryl.jpg'
        },
        {   id: 2,
            name: 'Place',
            description: 'Lovely, kid friendly',
            latitude: 111,
            longitude: 111,
            imageUrl: 'https://redbarrelsgames.com/wp-content/uploads/2024/03/OUTLAST_GALLERY01-576x324.jpg'
        }
      ],
      reviews: [
        {
          rating: 4,
          comment: "Great tour! Very informative and fun.",
          tourDate: {
              date: new Date('2024-11-10'),
              time: { hours: 10, minutes: 30 }
          },
          creationDate: {
              date: new Date('2024-11-11'),
              time: { hours: 14, minutes: 45 }
          }
      },
      {
          rating: 5,
          comment: "Amazing experience! Highly recommended.",
          tourDate: {
              date: new Date('2024-11-12'),
              time: { hours: 9, minutes: 0 }
          },
          creationDate: {
              date: new Date('2024-11-12'),
              time: { hours: 16, minutes: 0 }
          }
      },
      {
          rating: 3,
          comment: "The tour was okay, but I expected more details.",
          tourDate: {
              date: new Date('2024-11-13'),
              time: { hours: 11, minutes: 15 }
          },
          creationDate: {
              date: new Date('2024-11-14'),
              time: { hours: 10, minutes: 30 }
          }
      }
      ],
      transportDurations: [
          {
              time: {
                  hours: 1,
                  minutes: 30
              },
              transportType: TransportType.Car
          },
          {
              time: {
                  hours: 0,
                  minutes: 15
              },
              transportType: TransportType.Bicycle
          },
          {
              time: {
                  hours: 0,
                  minutes: 45
              },
              transportType: TransportType.Walking
          }
      ]
    };
   }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.user$.subscribe({
        next: (user: User) => {
            this.user = user
        }
    });
   // this.getCurrentTour()
  }

  getCurrentTour(): void {
    this.tourService.getTourById(this.tourId).subscribe({
      next: (result: Tour) => {
        this.currentTour = result
      }
    })
  }

  addToCart(): void {
        let orderItem : OrderItem = {
            tourId: this.currentTour.id,
            tourName: this.currentTour.name,
            price: this.currentTour.price,
            quantity: 1
        }
        this.marketService.addItemToCart(this.user.id, orderItem)
        alert('Added To Cart')
  }

}
