import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministrationService } from '../administration.service';
import { ClubInvitation } from '../model/club-invitation.model';

@Component({
  selector: 'xp-club-invitation-form-page',
  templateUrl: './club-invitation-form-page.component.html',
  styleUrls: ['./club-invitation-form-page.component.css']
})
export class ClubInvitationFormPageComponent implements OnInit {
  invitation: ClubInvitation | null = null;
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdministrationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
        this.isEditMode = true;
        this.service.getClubInvitationById(+id).subscribe({
            next: (invitation) => {
                this.invitation = invitation;
                console.log("Invitation: ", this.invitation); 
            },
            error: (err) => {
                console.error('Error fetching invitation:', err);
            },
        });
    }
}


  onFormSubmit(invitationData: ClubInvitation): void {
    if (this.isEditMode && this.invitation) {
      const updatedInvitation = { ...this.invitation, ...invitationData };
      this.service.updateClubInvitation(updatedInvitation).subscribe({
        next: () => {
          this.router.navigate(['/club-invitation']);
        },
        error: (err) => {
          console.error('Error updating invitation:', err);
        },
      });
    } else {
      this.service.addClubInvitation(invitationData).subscribe({
        next: () => {
          this.router.navigate(['/club-invitation']);
        },
        error: (err) => {
          console.error('Error adding invitation:', err);
        },
      });
    }
  }
}
