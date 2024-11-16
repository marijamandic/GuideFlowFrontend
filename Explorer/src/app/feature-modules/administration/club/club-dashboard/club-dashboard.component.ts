import { Component, OnInit } from '@angular/core';
import { ClubInvitation, ClubInvitationStatus } from '../../model/club-invitation.model';
import { ClubRequest, ClubRequestStatus } from '../../model/club-request.model';
import { ClubMemberList } from '../../model/club-member-list.model';
import { AdministrationService } from '../../administration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-club-dashboard',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.css']
})
export class ClubDashboardComponent implements OnInit {
  members: ClubMemberList[] = [];
  requests: ClubRequest[] = [];
  invitations: ClubInvitation[] = [];
  clubId: number;

  constructor(
    private service: AdministrationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clubId = +params['id'];
  
      if (!this.clubId || isNaN(this.clubId)) {
        console.error('Invalid clubId:', this.clubId);
        return;
      }
  
      this.getClubMembers();
      this.getMembershipRequests();
      this.getClubInvitations();
    });
  }  

  getClubMembers(): void {
    this.service.getAllClubMembers(this.clubId).subscribe({
      next: (result: ClubMemberList[]) => {
        this.members = result;
        console.log('Loaded club members:', result);
      },
      error: err => {
        console.error('Error loading club members:', err);
      }
    });
  }

  getMembershipRequests(): void {
    this.service.getClubRequestsByClubId(this.clubId).subscribe({
      next: (result: ClubRequest[]) => {
        this.requests = result.filter((request) => request.id !== undefined);
        console.log('Loaded club requests:', this.requests);
      },
      error: (err) => {
        console.error('Error loading club requests:', err);
      },
    });
  }
  

  getClubInvitations(): void {
    this.service.getClubInvitationsByClubId(this.clubId).subscribe({
      next: (result: ClubInvitation[]) => {
        this.invitations = result;
        console.log('Loaded club invitations:', result);
      },
      error: err => {
        console.error('Error loading club invitations:', err);
      }
    });
  }

  getRequestStatus(status: ClubRequestStatus): string {
    return ClubRequestStatus[status];
  }

  getInvitationStatus(status: ClubInvitationStatus): string {
    return ClubInvitationStatus[status];
  }

  acceptRequest(requestId: number): void {
    this.service.acceptClubRequest(requestId).subscribe({
      next: () => {
        console.log(`Request ${requestId} accepted.`);
        this.getMembershipRequests(); // Refresh the requests table
      },
      error: (err) => {
        console.error(`Error accepting request ${requestId}:`, err);
        this.getMembershipRequests(); // Refresh the requests table
      },
    });
  }
  
  declineRequest(requestId: number): void {
    this.service.declineClubRequest(requestId).subscribe({
      next: () => {
        console.log(`Request ${requestId} declined.`);
        this.getMembershipRequests(); // Refresh the requests table
      },
      error: (err) => {
        console.error(`Error declining request ${requestId}:`, err);
        this.getMembershipRequests(); // Refresh the requests table
      },
    });
  } 

}
