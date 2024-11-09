import { Component, OnInit } from '@angular/core';
import { PublicPointService } from '../tour-public-point.service';
import { PublicPoint, ApprovalStatus } from '../model/publicPoint.model';
import { PublicPointNotification } from '../model/publicPointNotification.model';

@Component({
  selector: 'app-public-point-requests',
  templateUrl: './public-point-requests.component.html',
  styleUrls: ['./public-point-requests.component.css']
})
export class PublicPointRequestsComponent implements OnInit {
  pendingPublicPoints: PublicPoint[] = [];
  rejectOverlayVisible: boolean[] = [];
  publicPointNotification: PublicPointNotification;
  rejectionComment: string[] = [];

  constructor(private publicPointService: PublicPointService) {}

  ngOnInit(): void {
    this.loadPendingPublicPoints();
  }
  openRejectOverlay(index: number): void {
    this.rejectOverlayVisible[index] = true;
  }

  closeRejectOverlay(index: number): void {
    this.rejectOverlayVisible[index] = false;
  }

  loadPendingPublicPoints(): void {
    this.publicPointService.getPendingPublicPoints().subscribe(
      (points) => {
        this.pendingPublicPoints = points;
      },
      (error) => {
        console.error('Error fetching pending public points', error);
      }
    );
  }

  getApprovalStatus(status: number): string {
    return ApprovalStatus[status] || 'Unknown';
  }

  acceptPublicPoint(point: PublicPoint): void {
    const notification: PublicPointNotification = {
        id: 0, 
        publicPointId: point.id,
        authorId: point.authorId, 
        isAccepted: true,
        comment: "",
        isRead: false,
        creationTime: new Date(), 
    };

    this.publicPointService.updatePublicPoint({ ...point, approvalStatus: ApprovalStatus.Accepted }).subscribe(
      () => {
        this.loadPendingPublicPoints();
        this.publicPointService.createNotification(notification).subscribe(
            () => {
              console.log('Notification created successfully');
              this.loadPendingPublicPoints();
            },
            (error) => console.error('Error creating notification', error)
          );
      },
      (error) => {
        console.error('Error accepting public point', error);
      }
    );
  }

  rejectPublicPoint(point: PublicPoint, index: number): void {
    const comment = this.rejectionComment[index];
    const notification: PublicPointNotification = {
      id: 0, 
      publicPointId: point.id,
      authorId: point.authorId, 
      isAccepted: false,
      comment: comment,
      isRead: false,
      creationTime: new Date(), 
    };

    this.publicPointService.updatePublicPoint({ ...point, approvalStatus: ApprovalStatus.Rejected }).subscribe(
      () => {
        this.publicPointService.createNotification(notification).subscribe(
          () => {
            console.log('Notification created successfully');
            this.loadPendingPublicPoints();
          },
          (error) => console.error('Error creating notification', error)
        );
      },
      (error) => console.error('Error rejecting public point', error)
    );
    this.closeRejectOverlay(index);
  }
}
