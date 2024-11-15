import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PublicPointService } from '../../tour-authoring/tour-public-point.service';
import { PublicPointNotification } from '../../tour-authoring/model/publicPointNotification.model';
import { ShoppingCart } from '../../marketplace/model/shoppingCart.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User | undefined;
  isDropdownOpen: boolean = false;
  notificationCount: number = 0;
  showNotifications: boolean = false;

  constructor(private authService: AuthService, private publiPointService: PublicPointService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.publiPointService.getUnreadNotificationsByAuthor(this.user?.id || 0).subscribe(
      (notifications: PublicPointNotification[]) => {
        this.notificationCount = notifications.length; 
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLogout(): void {
    this.toggleDropdown();
    this.authService.logout();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
