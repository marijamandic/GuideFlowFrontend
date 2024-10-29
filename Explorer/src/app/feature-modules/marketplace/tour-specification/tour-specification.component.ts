import { Component, OnInit } from '@angular/core';
import { TourSpecification } from '../model/tour-specification.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-specification',
  templateUrl: './tour-specification.component.html',
  styleUrls: ['./tour-specification.component.css']
})

export class TourSpecificationComponent implements OnInit {
  
 tourSpecification: TourSpecification[] = [];
 selectedTourSpecification: TourSpecification;
 shouldEdit: boolean;
 shouldRenderEquipmentForm: boolean = false;
 public userId: number;


  constructor(private service : MarketplaceService, private authService: AuthService) {
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id;
    })
  }

  ngOnInit(): void {
    this.getTourSpecification(this.userId);
  }

  getTourSpecification(userId: number) : void {
    this.service.getTourSpecification(userId).subscribe({
      next: (result: TourSpecification) => {
        console.log("API response:", result);
        this.tourSpecification = [result];
      },
      error: (err: any) => {
        console.log("Error fetching tour specification:", err);
      }
    });
  }
  
  onEditClicked(tourSpecification: TourSpecification) : void{
    this.selectedTourSpecification = tourSpecification;
    this.shouldEdit = true;
    this.shouldRenderEquipmentForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderEquipmentForm = true;
  }

  deleteTourSpecification(tourSpecification: TourSpecification) : void {
    this.service.deleteTourSpecification(tourSpecification).subscribe({
      next: (_) => {
        //this.getTourSpecification(this.userId)
        this.tourSpecification = this.tourSpecification.filter(ts => ts.id !== tourSpecification.id);
      }
    })
  }
}