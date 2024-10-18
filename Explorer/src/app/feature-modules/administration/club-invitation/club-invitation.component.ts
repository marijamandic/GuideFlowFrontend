import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ClubInvitation, ClubInvitationStatus } from '../model/club-invitation.model';

@Component({
  selector: 'xp-club-invitation',
  templateUrl: './club-invitation.component.html',
  styleUrls: ['./club-invitation.component.css']
})
export class ClubInvitationComponent implements OnInit {

  clubInvitations: ClubInvitation[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getClubInvitations();
  }

  getStatusDisplay(status: ClubInvitationStatus): string {
    switch (status) {
      case ClubInvitationStatus.PENDING:
        return 'Pending';
      case ClubInvitationStatus.ACCEPTED:
        return 'Accepted';
      case ClubInvitationStatus.DECLINED:
        return 'Declined';
      case ClubInvitationStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  }

  getClubInvitations(): void {
    this.service.getClubInvitations().subscribe({
      next: (result) => {
        this.clubInvitations = result;
        console.log(result);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  declineInvitation(id: number): void {
    this.service.declineClubInvitation(id).subscribe({
        next: () => {
            this.getClubInvitations();
        },
        error: (err: any) => {
            console.error(`Error while declining invitation: ${err}`);
        }
    });
  }
}
