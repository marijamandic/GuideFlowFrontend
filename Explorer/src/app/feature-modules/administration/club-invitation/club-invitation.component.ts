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
  selectedInvitation: ClubInvitation | null = null;
  shouldRenderForm: boolean = false;
  shouldEdit: boolean = false;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getClubInvitations();
  }

  getClubInvitations(): void {
    this.shouldRenderForm = false;
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

  deleteInvitation(id: number): void {
    this.service.deleteClubInvitation(id).subscribe({
      next: () => {
        this.getClubInvitations();
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  onEditClicked(invitation: ClubInvitation): void {
    this.selectedInvitation = invitation;
    this.shouldEdit = true;
    this.shouldRenderForm = true;
  }

  onAddClicked(): void {
    this.selectedInvitation = null;
    this.shouldEdit = false;
    this.shouldRenderForm = true;
  }
}
