import { Component, OnInit } from '@angular/core';
import { PublicPointService } from '../tour-public-point.service';
import { PublicPoint, ApprovalStatus } from '../model/publicPoint.model';

@Component({
  selector: 'app-public-point-requests',
  templateUrl: './public-point-requests.component.html',
  styleUrls: ['./public-point-requests.component.css']
})
export class PublicPointRequestsComponent implements OnInit {
  pendingPublicPoints: PublicPoint[] = [];

  constructor(private publicPointService: PublicPointService) {}

  ngOnInit(): void {
    this.loadPendingPublicPoints();
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
    this.publicPointService.updatePublicPoint({ ...point, approvalStatus: ApprovalStatus.Accepted }).subscribe(
      () => {
        this.loadPendingPublicPoints();
      },
      (error) => {
        console.error('Error accepting public point', error);
      }
    );
  }

  rejectPublicPoint(point: PublicPoint): void {
    this.publicPointService.updatePublicPoint({ ...point, approvalStatus: ApprovalStatus.Rejected }).subscribe(
      () => {
        this.loadPendingPublicPoints();
      },
      (error) => {
        console.error('Error rejecting public point', error);
      }
    );
  }
}
