import { Component, OnInit } from '@angular/core';
import { PublicPointService } from '../tour-public-point.service';
import { PublicPointNotification } from '../model/publicPointNotification.model';
import { PublicPoint, ApprovalStatus } from '../model/publicPoint.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
    selector: 'app-public-point-notifications',
    templateUrl: './public-point-notifications.component.html',
    styleUrls: ['./public-point-notifications.component.css'],
})
export class PublicPointNotificationsComponent implements OnInit {
    notifications: PublicPointNotification[] = [];
    unreadNotifications: PublicPointNotification[] = [];
    readNotifications: PublicPointNotification[] = [];
    totalCount: number = 0;
    selectedNotification: PublicPointNotification | null = null;
    selectedPoint: PublicPoint | null = null;
    showModal: boolean = false;
    private user: User | undefined;

    constructor(private publicPointService: PublicPointService, private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.user$.subscribe((user) => {
            this.user = user;
            console.log("OVO JE USER: ", this.user)
            console.log("EE", this.user?.id)
          });
        this.loadNotifications();
    }

    loadNotifications(page: number = 1, pageSize: number = 10): void {
        console.log("EE", this.user?.id)
        this.publicPointService.getNotificationsByAuthor(this.user?.id || 0).subscribe(
            (data) => {
                this.notifications = data;
                this.totalCount = this.notifications.length;

                this.unreadNotifications = this.notifications
                    .filter(n => !n.isRead)
                    .sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());

                this.readNotifications = this.notifications
                    .filter(n => n.isRead)
                    .sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());
                    console.log(this.readNotifications)
            },
            (error) => {
                console.error('Error loading notifications', error);
            }
        );
    }

    loadPublicPoint(publicPointId: number): void {
    }

    openNotificationDialog(notification: PublicPointNotification): void {
        this.selectedNotification = notification;
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

    closeModal(): void {
        this.showModal = false;
        this.selectedNotification = null;
        this.selectedPoint = null;
    }

    readNotification(notification: PublicPointNotification): void {
        this.publicPointService.updateNotification(notification.id, notification).subscribe(
            (point) => {
                this.loadNotifications();
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
}
