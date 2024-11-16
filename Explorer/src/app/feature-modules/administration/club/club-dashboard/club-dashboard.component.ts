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
  members: (ClubMemberList & { username?: string; firstName?: string; lastName?: string })[] = [];
  requests: (ClubRequest & { username?: string; firstName?: string; lastName?: string })[] = [];
  invitations: (ClubInvitation & { username?: string; firstName?: string; lastName?: string })[] = [];
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
        this.members.forEach((member) => {
          this.fetchUserDetails(member.userId, member);
        });
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
        this.requests.forEach((request) => {
          this.fetchUserDetails(request.touristId, request);
        });
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
        this.invitations.forEach((invitation) => {
          this.fetchUserDetails(invitation.touristId, invitation);
        });
        console.log('Loaded club invitations:', result);
      },
      error: err => {
        console.error('Error loading club invitations:', err);
      }
    });
  }

  fetchUserDetails(userId: number, target: any): void {
    this.service.getUsername(userId).subscribe({
      next: (username) => target.username = username,
      error: (err) => console.error(`Error fetching username for userId ${userId}:`, err)
    });
    this.service.getProfileInfoByUserId(userId).subscribe({
      next: (profile) => {
        target.firstName = profile.firstName;
        target.lastName = profile.lastName;
      },
      error: (err) => console.error(`Error fetching profile info for userId ${userId}:`, err)
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
