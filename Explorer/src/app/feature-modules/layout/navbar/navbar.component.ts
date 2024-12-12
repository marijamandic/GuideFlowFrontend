import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PublicPointService } from '../../tour-authoring/tour-public-point.service';
import { PublicPointNotification } from '../../tour-authoring/model/publicPointNotification.model';
import { ShoppingCart } from '../../marketplace/model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { AlertService } from '../alert.service';
import { LayoutService } from '../layout.service';
import { AdministrationService } from '../../administration/administration.service';
import { forkJoin, Observable, of } from 'rxjs';
import { ClubRequest, ClubRequestStatus } from '../../administration/model/club-request.model';
import { Notification } from '../model/Notification.model';
import { ClubInvitation } from '../../administration/model/club-invitation.model';
import { MessageNotification } from '../model/MessageNotification.model';

@Component({
	selector: 'xp-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	user: User | undefined;
	isDropdownOpen: boolean = false;
	notificationCount: number = 0;
	totalCount: number = 0;
	showNotifications: boolean = false;
	showCart = false;
	isMenuOpen: boolean = false;
	username: string;

  constructor(private authService: AuthService, private publiPointService: PublicPointService, private alertService: AlertService, private notificationService: LayoutService, private adminService: AdministrationService) {}

	ngOnInit(): void {
		this.authService.user$.subscribe(user => {
			this.user = user;
			this.username = user.username;
			console.log(user);
		});
		this.publiPointService.totalCount$.subscribe(count => {
			this.totalCount = count;
		});
		this.getUnread();
	}

	getBadgeClass(): string {
		if (!this.user) return '';
		switch (this.user.role) {
			case `administrator`:
				return 'notification-badgea';
			case `author`:
				return 'notification-badgeu';
			case `tourist`:
				return 'notification-badget';
			default:
				return '';
		}
	}

	getUnread(): void {
		this.totalCount = 0;
		let moneyExchangeNotifications$: Observable<Notification[]>;
		let clubRequests$: Observable<ClubRequest[]>;
		let clubInvitations$: Observable<ClubInvitation[]>;
		let messageNotifications$: Observable<MessageNotification[]>;
		const unreadNotifications$ = this.publiPointService.getUnreadNotificationsByAuthor(this.user?.id || 0);
	
		if (this.user?.role === 'tourist') {
			console.log("Tourist role detected");
			moneyExchangeNotifications$ = this.notificationService.getNotificationsByUserId(this.user?.id || 0);
			clubRequests$ = this.adminService.getClubRequestByOwner(this.user?.id || 0);
			clubInvitations$ = this.adminService.getClubInvitationsByOwner(this.user?.id || 0);
			messageNotifications$ = this.notificationService.getNotificationMessagesByUserId(this.user?.id || 0);
		} else if(this.user?.role === 'author') {
			console.log("Author role detected");
			moneyExchangeNotifications$ = this.notificationService.getNotificationsByAuthorId(this.user?.id || 0);
			clubRequests$ = of([]); 
			clubInvitations$ = of([]); 
			messageNotifications$ = of([]);
		} else {
			console.log("Admin role detected");
			moneyExchangeNotifications$ = of([]);
			clubRequests$ = of([]);
			clubInvitations$ = of([]);
			messageNotifications$ = of([]);
		}
	
		forkJoin([
			unreadNotifications$,
			moneyExchangeNotifications$,
			messageNotifications$,
			clubRequests$,
			clubInvitations$
		]).subscribe(
			([unreadNotifications, moneyExchangeNotifications, messageNotifications, clubRequests, clubInvitations]) => {
				this.totalCount += unreadNotifications.length;
				this.totalCount += moneyExchangeNotifications.filter(notification => !notification.isOpened).length;
				this.totalCount += messageNotifications.filter(notification => !notification.isOpened).length;
				this.totalCount += clubRequests.filter(request => request.status === 0).length;
				this.totalCount += clubInvitations.filter(request => request.status === 0).length;
	
				console.log("Total count:", this.totalCount);
	
				// Ažuriraj ukupni broj nepročitanih notifikacija
				this.publiPointService.updateTotalCount(this.totalCount);
			},
			error => {
				console.error('Error fetching notifications:', error);
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

	handleShoppingCartOpened() {
		this.showCart = false;
	}
}
