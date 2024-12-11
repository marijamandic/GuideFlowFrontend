import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PublicPointService } from '../../tour-authoring/tour-public-point.service';
import { PublicPointNotification } from '../../tour-authoring/model/publicPointNotification.model';
import { ShoppingCart } from '../../marketplace/model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { AlertService } from '../alert.service';
import { LayoutService } from '../layout.service';

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
  isMenuOpen: boolean = false;

  constructor(private authService: AuthService, private publiPointService: PublicPointService, private alertService: AlertService, private notificationService: LayoutService) {}

	ngOnInit(): void {
		this.authService.user$.subscribe(user => {
			this.user = user;
		});
		this.getUnread();
	}

  getUnread(): void {
    this.publiPointService.getUnreadNotificationsByAuthor(this.user?.id || 0).subscribe(
			(notifications: PublicPointNotification[]) => {
				this.notificationCount = notifications.length;
			},
			error => {
				console.error('Error fetching notifications:', error);
			}
		);
    this.notificationService.getNotificationsByUserId(this.user?.id || 0).subscribe(
      (moneyExchangeNotifications) => {
          const unopenedCount = moneyExchangeNotifications.filter(notification => !notification.isOpened).length;
          console.log(`Number of unopened notifications: ${unopenedCount}`);
          this.notificationCount += unopenedCount;
      },
      (error) => {
          console.error('Error loading money exchange notifications:', error);
      }
    );
    this.notificationService.getNotificationMessagesByUserId(this.user?.id || 0).subscribe(
      (messageNotifications) => {
        const unopenedCount = messageNotifications.filter(notification => !notification.isOpened).length;
        console.log(`Number of unopened notifications: ${unopenedCount}`);
        this.notificationCount += unopenedCount;      },
      (error) => {
          console.error('Error loading money exchange notifications:', error);
      }
    );  
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.isMenuOpen = false; 
      this.showNotifications = false;
  }
  }
	onLogout(): void {
		this.toggleDropdown();
		this.authService.logout();
	}

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.isMenuOpen = false; 
      this.isDropdownOpen = false;
  }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isDropdownOpen = false; 
      this.showNotifications = false;
  }
  }
}
