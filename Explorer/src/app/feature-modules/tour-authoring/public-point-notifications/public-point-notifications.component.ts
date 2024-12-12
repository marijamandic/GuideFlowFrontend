import { Component, OnInit } from '@angular/core';
import { PublicPointService } from '../tour-public-point.service';
import { PublicPointNotification } from '../model/publicPointNotification.model';
import { PublicPoint, ApprovalStatus } from '../model/publicPoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { LayoutService } from '../../layout/layout.service';
import { Notification } from '../../layout/model/Notification.model';
import { Observable, retry } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from '../../layout/model/problem-notification.model';
import { MessageNotification } from '../../layout/model/MessageNotification.model';
import { Router } from '@angular/router';
import { ClubRequest, ClubRequestStatus } from '../../administration/model/club-request.model';
import { AdministrationService } from '../../administration/administration.service';
import { ClubInvitation, ClubInvitationStatus } from '../../administration/model/club-invitation.model';

@Component({
    selector: 'app-public-point-notifications',
    templateUrl: './public-point-notifications.component.html',
    styleUrls: ['./public-point-notifications.component.css'],
})
export class PublicPointNotificationsComponent implements OnInit {
    totalCount: number = 0;
    selectedNotification: PublicPointNotification | null = null;
    combinedNotifications: { type: number; data: PublicPointNotification | Notification | ProblemNotification | MessageNotification | ClubRequest | ClubInvitation, creationTime: Date, isOpened: boolean }[] = [];
    selectedPoint: PublicPoint | null = null;
    public publicPoints: PublicPoint[] = [];
    showModal: boolean = false;
    private user: User | undefined;

    constructor(private publicPointService: PublicPointService, private authService: AuthService, private notificationService: LayoutService, private router: Router, private clubRequestService: AdministrationService) {}

    ngOnInit(): void {
        this.authService.user$.subscribe((user) => {
            this.user = user;
          });
        this.publicPointService.getPublicPoints(1, 100).subscribe(response => {
            this.publicPoints = response.results;
        }, error => {
            console.error('Error fetching public points:', error);
        });
        this.loadAllNotifications();
    }


    loadPublicPoint(publicPointId: number): string {
        const publicPoint = this.publicPoints.find(point => point.id === publicPointId);
        return publicPoint ? publicPoint.name : 'Unknown Public Point';
    }    

    openNotificationDialog(notification: PublicPointNotification): void {
        this.selectedNotification = notification;
        console.log("EEE");
        this.publicPointService.getPublicPointsByTour(notification.publicPointId).subscribe(
            (point) => {
                console.log(point)
                this.selectedPoint = point;
                this.showModal = true;
                notification.isRead = true;
                this.readNotification(notification);
            },
            (error) => {
                console.error('Error fetching public point details', error);
            }
        );
    }

    markAsRead(notification: Notification): void {
        this.notificationService.updateNotification(notification.id, {
            ...notification,
            isOpened: true
        }).subscribe({
            next: () => {
                console.log('Notification marked as read');
                // Nakon uspešnog ažuriranja, osvežite notifikacije
                this.loadAllNotifications();
            },
            error: (err) => console.error('Error marking notification as read:', err)
        });
    }
    
    problemButton(notification: Notification): void {  
        notification.isOpened == false;
        this.markAsRead(notification);
    }

    moneyButton(notification: Notification): void { 
        this.markAsRead(notification); 
    }

    clubButton(notification: Notification): void { 
        this.markAsRead(notification);
    }

    messageButton(notification: MessageNotification): void {
        this.notificationService.updateMessageNotification(notification.id, true).subscribe({
            next: () => {
                console.log('Notification marked as read'),
                this.loadAllNotifications();
            },
            error: (err) => console.error('Error updating notification:', err),
        });        
    }
    
    navigate(notification: MessageNotification): void {
        var url = `${notification.isBlog? "blog" : "tour-more-detail"}`
        this.router.navigate([url, notification.objectId])
    }

    closeModal(): void {
        this.showModal = false;
        this.selectedNotification = null;
        this.selectedPoint = null;
    }

    readNotification(notification: PublicPointNotification): void {
        this.publicPointService.updateNotification(notification.id, notification).subscribe(
            (point) => {
                this.loadAllNotifications();
            },
            (error) => {
                console.error('Error updating notification', error);
            }
        );
    }

    getApprovalStatus(status: ApprovalStatus): string {
        switch (status) {
            case ApprovalStatus.Pending:
                return 'Pending';
            case ApprovalStatus.Accepted:
                return 'Accepted';
            case ApprovalStatus.Rejected:
                return 'Rejected';
            default:
                return 'Unknown';
        }
    }

    truncateComment(comment: string, length: number) {
        if (comment && comment.length > length) {
          return comment.substring(0, 40) + '...';
        }
        return comment || 'No comment provided';
    }
    
    loadAllNotifications(): void {
        const userId = this.user?.id || 0;
        this.combinedNotifications = [];
        this.publicPointService.getNotificationsByAuthor(userId).subscribe(
            (publicPointNotifications) => {
                const publicPointMapped = publicPointNotifications.map(notification => ({
                    type: 0, // PublicPointNotification
                    data: notification,
                    creationTime: notification.creationTime,
                    isOpened: notification.isRead
                }));
                this.combinedNotifications = [...this.combinedNotifications, ...publicPointMapped];
            },
            (error) => {
                console.error('Error loading public point notifications:', error);
            }
        );

        if (this.user?.role == 'tourist') {
            this.notificationService.getNotificationsByUserId(userId).subscribe(
                (moneyExchangeNotifications) => {
                    const moneyExchangeMapped = moneyExchangeNotifications.map(notification => ({
                        type: 1, // Notification (Money and Club)
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened
                    }));
                    this.combinedNotifications = [...this.combinedNotifications, ...moneyExchangeMapped];
                    this.sortNotifications();
                },
                (error) => {
                    console.error('Error loading money exchange notifications:', error);
                }
            );
		} else {
            this.notificationService.getNotificationsByAuthorId(userId).subscribe(
                (moneyExchangeNotifications) => {
                    const moneyExchangeMapped = moneyExchangeNotifications.map(notification => ({
                        type: 1, // Notification (Money and Club)
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened
                    }));
                    this.combinedNotifications = [...this.combinedNotifications, ...moneyExchangeMapped];
                    this.sortNotifications();
                },
                (error) => {
                    console.error('Error loading money exchange notifications:', error);
                }
            );
		}
    
        this.notificationService.getProblemNotificationsByUserId(this.user?.role || "tourist").subscribe(
            (problemNotifications: PagedResults<ProblemNotification>) => {
                const problemNotificationMapped = problemNotifications.results.map(notification => ({
                    type: 2, // Problem
                    data: notification,
                    creationTime: notification.createdAt,
                    isOpened: notification.isOpened
                }));
                this.combinedNotifications = [...this.combinedNotifications, ...problemNotificationMapped];
                console.log("PROBLEM", problemNotificationMapped);
                this.sortNotifications();
            },
            (error) => {
                console.error('Error loading problem notifications:', error);
            }
        );  

        this.notificationService.getNotificationMessagesByUserId(userId).subscribe(
            (moneyExchangeNotifications) => {
                const moneyExchangeMapped = moneyExchangeNotifications.map(notification => ({
                    type: 3, // Message
                    data: notification,
                    creationTime: notification.createdAt,
                    isOpened: notification.isOpened
                }));
                this.combinedNotifications = [...this.combinedNotifications, ...moneyExchangeMapped];
                this.sortNotifications();
            },
            (error) => {
                console.error('Error loading money exchange notifications:', error);
            }
        );   

        this.clubRequestService.getClubRequestByOwner(userId).subscribe(
            (clubRequests) => {
                const publicPointMapped = clubRequests
                    .filter(notification => notification.status === ClubRequestStatus.PENDING)
                    .map(notification => ({
                        type: 4, // ClubRequest
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened
                    }));
                this.combinedNotifications = [...this.combinedNotifications, ...publicPointMapped];
            },
            (error) => {
                console.error('Error loading public point notifications:', error);
            }
        );   
        
        this.clubRequestService.getClubInvitationsByOwner(userId).subscribe(
            (clubInvitations) => {
                const clubInvitationMapped = clubInvitations
                    .filter(notification => notification.status === ClubInvitationStatus.PENDING)
                    .map(notification => ({
                        type: 5,
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened
                    }));
                    console.log("EvoE: ", clubInvitationMapped)
                this.combinedNotifications = [...this.combinedNotifications, ...clubInvitationMapped];
            },
            (error) => {
                console.error('Error loading public point notifications:', error);
            }
        );     

        this.sortNotifications();
    }
    sortNotifications(): void {
        this.combinedNotifications = this.combinedNotifications.sort(
            (a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );

        this.totalCount = 0;

        this.combinedNotifications.forEach(notification => {
            if (!notification.isOpened) {
                this.totalCount++;
            }
        });

        // Emitujte novi totalCount
        this.publicPointService.updateTotalCount(this.totalCount);

        console.log("Total opened notifications count: ", this.totalCount);
        console.log("Sorted: ", this.combinedNotifications);
        console.log("Total opened notifications count: ", this.totalCount);
    }
    
    isPublicPointNotification(notification: { type: number; data: any }): notification is { type: 0; data: PublicPointNotification } {
        return notification.type === 0;
    }
    isNotification(notification: {type: number; data: any }): notification is { type: 1; data: Notification} {
        return notification.type === 1;
    }
    isProblemNotification(notification: {type: number; data: any }): notification is { type: 2; data: ProblemNotification} {
        return notification.type === 2;
    }
    isMessageNotification(notification: {type: number; data: any }): notification is { type: 3; data: MessageNotification} {
        return notification.type === 3;
    }
    isClubRequest(notification: {type: number; data: any}): notification is { type: 4; data: ClubRequest} {
        return notification.type === 4;
    }
    isClubInvitation(notification: {type: number; data: any}): notification is { type: 5; data: ClubInvitation} {
        return notification.type === 5;
    }
    isPending(notification: {type: number; data: any}): boolean {
        return notification.data.status == ClubRequestStatus.PENDING;
    }
    isPendingInvitation(notification: {type: number; data: any}): boolean {
        return notification.data.status == ClubInvitationStatus.PENDING;
    }

    markAllAsRead(): void {
        this.combinedNotifications.forEach(notification => {
            notification.isOpened = true;
        });
    
        this.combinedNotifications.forEach(notification => {
            if (this.isPublicPointNotification(notification)) {
                const publicPointNotification = notification.data as PublicPointNotification;
                this.publicPointService.updateNotification(publicPointNotification.id, {
                    ...publicPointNotification,
                    isRead: true
                }).subscribe({
                    error: err => console.error('Error marking notification as read:', err)
                });
            } else if (this.isNotification(notification)) {
                const normalNotification = notification.data as Notification;
                this.notificationService.updateNotification(normalNotification.id, {
                    ...normalNotification,
                    isOpened: true
                }).subscribe({
                    error: err => console.error('Error marking notification as read:', err)
                });
            }
        });
    
        console.log("All notifications marked as read.");
    }

    getStatusLabel(status: ClubRequestStatus): string {
        switch (status) {
            case ClubRequestStatus.PENDING:
                return 'Pending';
            case ClubRequestStatus.ACCEPTED:
                return 'Accepted';
            case ClubRequestStatus.DECLINED:
                return 'Declined';
            case ClubRequestStatus.CANCELLED:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    }
    
    acceptRequest(request: ClubRequest): void {
        this.clubRequestService.acceptClubRequest(request.id || 0).subscribe({
          next: () => {
            console.log(`Request ${request.id} accepted.`);
          },
          error: (err) => {
            console.error(`Error accepting request ${request.id}:`, err);
          },
        });
        const newNotification: Notification = {
          id: 0,
          userId: request.touristId, // Postavite ID korisnika
          sender: this.user?.username || '', // Pošiljalac, može biti statički ili dinamički
          message: `The request for ${request.clubName} has been accepted.`, // Poruka sa imenom kluba
          createdAt: new Date(), // Trenutno vreme
          isOpened: false, // Podrazumevano nije pročitano
          type: 2, // Tip je 2 (ClubNotification)
        };
        
        this.notificationService.createTouristNotifaction(newNotification).subscribe({
            next: () => {
                console.log('Notification successfully created');
                this.loadAllNotifications();
            },
            error: (err) => {
                console.error('Error creating notification:', err);
                this.loadAllNotifications();
            },
        });
      }
      
      declineRequest(request: ClubRequest & { username?: string; firstName?: string; lastName?: string }): void {
        this.clubRequestService.declineClubRequest(request.id || 0).subscribe({
          next: () => {
            console.log(`Request ${request.id} declined.`);
          },
          error: (err) => {
            console.error(`Error declining request ${request.id}:`, err);
          },
        });
    
        const newNotification: Notification = {
          id: 0,
          userId: request.touristId, // Postavite ID korisnika
          sender: this.user?.username || '', // Pošiljalac, može biti statički ili dinamički
          message: `The request for ${request.clubName} has been rejected.`, // Poruka sa imenom kluba
          createdAt: new Date(), // Trenutno vreme
          isOpened: false, // Podrazumevano nije pročitano
          type: 2, // Tip je 2 (ClubNotification)
        };
        
        this.notificationService.createTouristNotifaction(newNotification).subscribe({
            next: () => {
                console.log('Notification successfully created');
                this.loadAllNotifications();
            },
            error: (err) => {
                console.error('Error creating notification:', err);
                this.loadAllNotifications();
            },
        });
      } 

      acceptInvitation(request: ClubInvitation): void {
        this.clubRequestService.acceptClubInvitation(request.id || 0).subscribe({
          next: () => {
            console.log(`Request ${request.id} accepted.`);
          },
          error: (err) => {
            console.error(`Error accepting request ${request.id}:`, err);
          },
        });
        const newNotification: Notification = {
          id: 0,
          userId: request.ownerId,
          sender: this.user?.username || '', 
          message: `Accepted your invitation to join in your club ${request.clubName}.`,
          createdAt: new Date(), 
          isOpened: false, 
          type: 2,
        };
        
        this.notificationService.createTouristNotifaction(newNotification).subscribe({
            next: () => {
                console.log('Notification successfully created');
                this.loadAllNotifications();
            },
            error: (err) => {
                console.error('Error creating notification:', err);
                this.loadAllNotifications();
            },
        });
      }
      
      declineInvitation(request: ClubInvitation & { username?: string; firstName?: string; lastName?: string }): void {
        this.clubRequestService.declineClubInvitation(request.id || 0).subscribe({
          next: () => {
            console.log(`Request ${request.id} declined.`);
          },
          error: (err) => {
            console.error(`Error declining request ${request.id}:`, err);
          },
        });
    
        const newNotification: Notification = {
          id: 0,
          userId: request.ownerId,
          sender: this.user?.username || '', 
          message: `Rejected your invitation to join in your club ${request.clubName}.`,
          createdAt: new Date(), 
          isOpened: false, 
          type: 2, 
        };
        
        this.notificationService.createTouristNotifaction(newNotification).subscribe({
            next: () => {
                console.log('Notification successfully created');
                this.loadAllNotifications();
            },
            error: (err) => {
                console.error('Error creating notification:', err);
                this.loadAllNotifications();
            },
        });
      } 
            
}
