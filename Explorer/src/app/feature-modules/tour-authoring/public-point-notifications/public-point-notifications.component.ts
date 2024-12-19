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
    combinedNotifications: { type: number; data: PublicPointNotification | Notification | ProblemNotification | MessageNotification | ClubRequest | ClubInvitation, creationTime: Date, isOpened: boolean, showMenu: boolean }[] = [];
    selectedPoint: PublicPoint | null = null;
    public publicPoints: PublicPoint[] = [];
    showModal: boolean = false;
    private user: User | undefined;
    showHeaderMenu: boolean = false;

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

    toggleMenu(event: MouseEvent, notification: any): void {
        event.stopPropagation(); // Sprečava propagaciju događaja
        notification.showMenu = !notification.showMenu;
    }

    deleteNotification(notification: any): void {
        this.combinedNotifications = this.combinedNotifications.filter(n => n !== notification);
        console.log("Notifikacija obrisana:", notification);

        if(notification.type == 0) {
            this.publicPointService.deleteNotification(notification.data.id).subscribe({
                next: () => {
                    console.log(`Notification with ID ${notification.id} successfully deleted.`);
                },
                error: (err) => {
                    console.error(`Failed to delete notification with ID ${notification.id}:`, err);
                },
            });
        }
        
        if(notification.type == 1 || 2) {
            if(this.user?.role == 'tourist') {
                this.notificationService.deleteNotification(notification.data.id).subscribe({
                    next: () => {
                        console.log(`Notification with ID ${notification.data.id} successfully deleted.`);
                    },
                    error: (err) => {
                        console.error(`Failed to delete notification with ID ${notification.data.id}:`, err);
                    },
                });
            } else if(this.user?.role == 'author') {
                this.notificationService.deleteAuthorNotification(notification.data.id).subscribe({
                    next: () => {
                        console.log(`Notification with ID ${notification.data.id} successfully deleted.`);
                    },
                    error: (err) => {
                        console.error(`Failed to delete notification with ID ${notification.data.id}:`, err);
                    },
                });
            }
        }

        if(notification.type == 3) {
            if(this.user?.role == 'tourist') {
                this.notificationService.deleteMessageNotification(notification.data.id).subscribe({
                    next: () => {
                      console.log(`Message notification with ID ${notification.data.id} successfully deleted.`);
                    },
                    error: (err) => {
                      console.error(`Failed to delete message notification with ID ${notification.data.id}:`, err);
                    },
                });
            } else if(this.user?.role == 'author') {
                this.notificationService.deleteAuthorMessageNotification(notification.data.id).subscribe({
                    next: () => {
                      console.log(`Message notification with ID ${notification.data.id} successfully deleted.`);
                    },
                    error: (err) => {
                      console.error(`Failed to delete message notification with ID ${notification.data.id}:`, err);
                    },
                });
            }
            
        }

        if(notification.type == 4) {
            this.clubRequestService.deleteClubRequest(notification.data.id).subscribe({
                next: () => {
                    console.log(`Request with ID ${notification.data.id} successfully deleted.`);
                },
                error: (err) => {
                    console.error(`Failed to delete request with ID ${notification.data.id}:`, err);
                },
            });
        }

        if(notification.type == 5) {
            this.clubRequestService.deleteClubInvitation(notification.data.id).subscribe({
                next: () => {
                  console.log(`Invitation with ID ${notification.data.id} successfully deleted.`);
                },
                error: (err) => {
                  console.error(`Failed to delete invitation with ID ${notification.data.id}:`, err);
                },
              });
        }
    }

    toggleHeaderMenu(event: MouseEvent): void {
        event.stopPropagation();
        this.showHeaderMenu = !this.showHeaderMenu;
    }

    closeHeaderMenu(): void {
        this.showHeaderMenu = false;
    }

    deleteAllNotifications(): void {
        const notificationsToDelete = [...this.combinedNotifications];
    
        notificationsToDelete.forEach(notification => {
            this.deleteNotification(notification);
        });
    
        this.combinedNotifications = [];
        console.log("All notifications deleted.");
        this.closeHeaderMenu();
    }    

    loadPublicPoint(publicPointId: number): string {
        const publicPoint = this.publicPoints.find(point => point.id === publicPointId);
        return publicPoint ? publicPoint.name : 'Unknown Public Point';
    }    

    openNotificationDialog(notification: PublicPointNotification): void {
        this.selectedNotification = notification;
        console.log("EEE1");
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

    markAsRead(notification: any): void {
        console.log("Marking as read:", notification);
    
        // Type 0: Public Point Notification
        if (notification.type === 0) {
            this.publicPointService.updateNotification(notification.data.id, {
                ...notification.data,
                isRead: true,
            }).subscribe({
                next: () => {
                    console.log(`Public Point Notification with ID ${notification.data.id} marked as read.`);
                    this.loadAllNotifications();
                },
                error: (err) => console.error(`Error marking Public Point Notification with ID ${notification.data.id} as read:`, err),
            });
        }
    
        // Type 1 or 2: General Notifications
        if (notification.type === 1 || notification.type === 2) {
            if (this.user?.role === 'tourist') {
                // Pozovi metodu za turiste
                this.notificationService.updateNotification(notification.data.id, {
                    ...notification.data,
                    isOpened: true,
                }).subscribe({
                    next: () => {
                        console.log(`Tourist Notification with ID ${notification.data.id} marked as read.`);
                        this.loadAllNotifications();
                    },
                    error: (err) => console.error(`Error marking Tourist Notification with ID ${notification.data.id} as read:`, err),
                });
            } else if (this.user?.role === 'author') {
                // Pozovi metodu za autore
                this.notificationService.updateAuthorNotification(notification.data.id, {
                    ...notification.data,
                    isOpened: true,
                }).subscribe({
                    next: () => {
                        console.log(`Author Notification with ID ${notification.data.id} marked as read.`);
                        this.loadAllNotifications();
                    },
                    error: (err) => console.error(`Error marking Author Notification with ID ${notification.data.id} as read:`, err),
                });
            } else {
                console.error('Unknown user role. Notification not updated.');
            }
        }

    
        // Type 3: Message Notifications
        if (notification.type === 3) {
            console.log("##", this.user?.role);
            const updateMethod = this.user?.role === 'tourist' 
                ? this.notificationService.updateMessageNotification 
                : this.notificationService.updateAuthorMessageNotification;
    
            updateMethod.call(this.notificationService, notification.data.id, true).subscribe({
                next: () => {
                    console.log(`Message Notification with ID ${notification.data.id} marked as read.`);
                    this.loadAllNotifications();
                },
                error: (err) => console.error(`Error marking Message Notification with ID ${notification.data.id} as read:`, err),
            });
        }
    
        /* Type 4: Club Requests
        if (notification.type === 4) {
            this.clubRequestService.cancelClubRequest(notification.data.id).subscribe({
                next: () => {
                    console.log(`Club Request with ID ${notification.data.id} marked as read.`);
                    this.loadAllNotifications();
                },
                error: (err) => console.error(`Error marking Club Request with ID ${notification.data.id} as read:`, err),
            });
        }
    
        // Type 5: Club Invitations
        if (notification.type === 5) {
            notification.data.status = ClubInvitationStatus.CANCELLED;
            this.clubRequestService.updateClubInvitation(notification.data).subscribe({
                next: () => {
                    console.log(`Club Invitation with ID ${notification.data.id} marked as read.`);
                    this.loadAllNotifications();
                },
                error: (err) => console.error(`Error marking Club Invitation with ID ${notification.data.id} as read:`, err),
            });
        }*/
    }
    
    
    problemButton(notification: any): void {  
        notification.data.isOpened == false;
        this.markAsRead(notification);
    }

    moneyButton(notification: any): void { 
        this.markAsRead(notification); 
    }

    clubButton(notification: any): void { 
        this.markAsRead(notification);
    }

    messageButton(notification: any): void {
        this.markAsRead(notification);  
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
        console.log("EEE");
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
                    isOpened: notification.isRead,
                    showMenu: false
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
                        isOpened: notification.isOpened,
                        showMenu: false
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
                        isOpened: notification.isOpened,
                        showMenu: false
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
                    isOpened: notification.isOpened,
                    showMenu: true
                }));
                this.combinedNotifications = [...this.combinedNotifications, ...problemNotificationMapped];
                console.log("PROBLEM", problemNotificationMapped);
                this.sortNotifications();
            },
            (error) => {
                console.error('Error loading problem notifications:', error);
            }
        );  

        if (this.user?.role == 'tourist') {
            this.notificationService.getNotificationMessagesByUserId(userId).subscribe(
                (moneyExchangeNotifications) => {
                    const moneyExchangeMapped = moneyExchangeNotifications.map(notification => ({
                        type: 3, // Message
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened,
                        showMenu: false,
                    }));
                    this.combinedNotifications = [...this.combinedNotifications, ...moneyExchangeMapped];
                    this.sortNotifications();
                },
                (error) => {
                    console.error('Error loading money exchange notifications:', error);
                }
            );   
        } else {
            this.notificationService.getAuthorNotificationMessagesByUserId(userId).subscribe(
                (moneyExchangeNotifications) => {
                    const moneyExchangeMapped = moneyExchangeNotifications.map(notification => ({
                        type: 3, // Message
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened,
                        showMenu: false,
                    }));
                    this.combinedNotifications = [...this.combinedNotifications, ...moneyExchangeMapped];
                    this.sortNotifications();
                },
                (error) => {
                    console.error('Error loading money exchange notifications:', error);
                }
            );   
        }

        this.clubRequestService.getClubRequestByOwner(userId).subscribe(
            (clubRequests) => {
                const publicPointMapped = clubRequests
                    .filter(notification => notification.status === ClubRequestStatus.PENDING)
                    .map(notification => ({
                        type: 4, // ClubRequest
                        data: notification,
                        creationTime: notification.createdAt,
                        isOpened: notification.isOpened,
                        showMenu: false,
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
                        isOpened: notification.isOpened,
                        showMenu: false,
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
            this.markAsRead(notification);
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
            } else if (this.isMessageNotification(notification)) {
                this.notificationService.updateMessageNotification(notification.data.id, true).subscribe({
                    next: () => {
                      console.log('Notification updated successfully');
                    },
                    error: (err) => {
                      console.error('Error updating notification:', err);
                    },
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
