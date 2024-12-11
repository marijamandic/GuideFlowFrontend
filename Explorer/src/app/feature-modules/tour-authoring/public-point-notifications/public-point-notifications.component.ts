import { Component, OnInit } from '@angular/core';
import { PublicPointService } from '../tour-public-point.service';
import { PublicPointNotification } from '../model/publicPointNotification.model';
import { PublicPoint, ApprovalStatus } from '../model/publicPoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { LayoutService } from '../../layout/layout.service';
import { Notification } from '../../layout/model/Notification.model';
import { retry } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from '../../layout/model/problem-notification.model';
import { MessageNotification } from '../../layout/model/MessageNotification.model';

@Component({
    selector: 'app-public-point-notifications',
    templateUrl: './public-point-notifications.component.html',
    styleUrls: ['./public-point-notifications.component.css'],
})
export class PublicPointNotificationsComponent implements OnInit {
    totalCount: number = 0;
    selectedNotification: PublicPointNotification | null = null;
    combinedNotifications: { type: number; data: PublicPointNotification | Notification | ProblemNotification | MessageNotification, creationTime: Date, isOpened: boolean }[] = [];
    selectedPoint: PublicPoint | null = null;
    public publicPoints: PublicPoint[] = [];
    showModal: boolean = false;
    private user: User | undefined;

    constructor(private publicPointService: PublicPointService, private authService: AuthService, private notificationService: LayoutService) {}

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
        this.sortNotifications();
    }
    sortNotifications(): void {
        this.combinedNotifications = this.combinedNotifications.sort(
            (a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );
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
    
    
}
