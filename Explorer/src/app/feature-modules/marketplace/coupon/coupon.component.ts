import { Component, OnInit } from '@angular/core';
import { Coupon } from '../model/coupon.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourService } from '../../tour-authoring/tour.service';
import { MarketplaceService } from '../marketplace.service';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {
 

coupons: Coupon[] = [];
user: User;
tours: Tour[] = [];
selectedCoupon: Coupon | null = null;
selectedTour: Tour | null = null;
showCreateModal: boolean = false;
showEditModal: boolean = false;
    
constructor(private authService: AuthService, private marketplaceService: MarketplaceService, private tourService: TourService) {}
    
ngOnInit(): void {

    this.authService.user$.subscribe(user => {
        this.user = user;

        if (this.user && this.user.id) {
            this.loadCouponsByAuthorId(this.user.id);
            this.loadToursByAuthorId();
        }

    });

}
    

private loadCouponsByAuthorId(authorId: number): void {
    this.marketplaceService.getCouponsByAuthorId(authorId).subscribe(
    (coupons) => {
        this.coupons = coupons;
    },
    (error) => {
            console.error('Error fetching coupons:', error);
    }
    );
}

private loadToursByAuthorId(): void {
    this.tourService.getTour().subscribe(
    (tours) => {
        this.tours = tours.results;
    },
    (error) => {
        console.error('Error fetching tours:', error);
}
    );
}

getTourTitle(tourId: number): string{
    const tour = this.tours.find((t) => t.id === tourId);
    return tour ? tour.name : 'Unknown Tour';
}

deleteCoupon(couponId: number): void {
    this.marketplaceService.deleteCoupon(couponId).subscribe(
        () => {
            this.coupons = this.coupons.filter((c) => c.id !== couponId);
        },
        (error) => {
            console.error('Error deleting coupon:', error);
        }
        );
}

openEditModal(coupon: Coupon): void {
    this.selectedCoupon = { ...coupon }; // Pass a copy of the coupon
    this.selectedTour = null; // Reset selected tour
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCoupon = null;
    this.selectedTour = null;
  }

  selectTour(tour: Tour): void {
    // Select the tour and uncheck the 'validForAllTours' checkbox
    this.selectedTour = tour;
    if (this.selectedCoupon) {
      this.selectedCoupon.tourId = tour.id;
      this.selectedCoupon.validForAllTours = false; // Automatically uncheck 'validForAllTours'
    }
  }
  
  toggleValidForAllTours(): void {
    // Toggle the 'validForAllTours' checkbox
    if (this.selectedCoupon) {
      this.selectedCoupon.validForAllTours = !this.selectedCoupon.validForAllTours;
  
      if (this.selectedCoupon.validForAllTours) {
        // Unselect the selected tour when 'validForAllTours' is checked
        this.selectedTour = null;
        this.selectedCoupon.tourId = null;
      }
    }
  }
  
  
  updateCoupon(): void {
    if (this.selectedCoupon) {
      // Clone the selectedCoupon to avoid modifying the original object
      const formattedCoupon: {
        id: number;
        authorId: number;
        tourId?: number | null;
        code: string;
        discount: number;
        expiryDate?: string; // ISO format as string
        validForAllTours: boolean;
        redeemed: boolean;
      } = { ...this.selectedCoupon };
  
      // Format expiryDate to ISO 8601 if it exists
      if (formattedCoupon.expiryDate) {
        const expiryDate = new Date(formattedCoupon.expiryDate);
        formattedCoupon.expiryDate = expiryDate.toISOString(); // Convert to ISO 8601
      }
  
      console.log('Payload being sent to updateCoupon:', formattedCoupon);
  
      // Send the updated coupon to the backend
      this.marketplaceService.updateCoupon(formattedCoupon.id, formattedCoupon).subscribe(
        (updatedCoupon) => {
          const index = this.coupons.findIndex((c) => c.id === updatedCoupon.id);
          if (index !== -1) {
            this.coupons[index] = updatedCoupon;
          }
          this.closeEditModal(); // Close the modal
        },
        (error) => {
          console.error('Error updating coupon:', error);
        }
      );
    }
  }
  createCoupon(): void {
    if (this.selectedCoupon) {
      const formattedCoupon = { ...this.selectedCoupon };
  
      // Format expiryDate to ISO 8601 if it exists
      if (formattedCoupon.expiryDate) {
        formattedCoupon.expiryDate = new Date(formattedCoupon.expiryDate).toISOString();
      }
  
      // Send the coupon data to the backend
      this.marketplaceService.createCoupon(formattedCoupon).subscribe(
        (createdCoupon) => {
          this.coupons.push(createdCoupon); // Add the new coupon to the list
          this.closeCreateModal(); // Close the modal
        },
        (error) => {
          console.error('Error creating coupon:', error);
        }
      );
    }
  }

  openCreateModal(): void {
    this.selectedCoupon = {
      id: 0, // Set to 0 or an appropriate default for creation
      authorId: this.user.id, // Use the logged-in user's ID
      tourId: null, // Default to no tour selected
      code: '',
      discount: 0,
      expiryDate: undefined,
      validForAllTours: false,
      redeemed: false,
    };
    this.selectedTour = null; // No tour selected by default
    this.showCreateModal = true; // Open the create modal
  }
  
  closeCreateModal(): void {
    this.showCreateModal = false;
    this.selectedCoupon = null;
    this.selectedTour = null;
  }
  
  
  
}
