import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { ClubInvitation } from '../model/club-invitation.model';

@Component({
  selector: 'xp-club-invitation-form',
  templateUrl: './club-invitation-form.component.html',
  styleUrls: ['./club-invitation-form.component.css']
})
export class ClubInvitationFormComponent implements OnInit {
  invitationForm: FormGroup;
  isEditMode: boolean = false;
  invitationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AdministrationService
  ) {
    // Initialize the form
    this.invitationForm = this.fb.group({
      clubId: ['', Validators.required],
      touristId: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.invitationId = +id;
      this.loadInvitation(this.invitationId);
    } else {
      this.invitationForm.removeControl('status'); 
    }
  }

  getStatusDisplay(status: number): string {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case 2:
        return 'Declined';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  }

  loadInvitation(id: number): void {
    this.service.getClubInvitationById(id).subscribe({
      next: (invitation) => {
        this.invitationForm.patchValue({
          clubId: invitation.clubId,
          touristId: invitation.touristId,
          status: this.getStatusDisplay(invitation.status)
        });
      },
      error: (err) => {
        console.error('Error fetching invitation:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.invitationForm.valid) {
      const invitationData = this.invitationForm.value;
      if (this.isEditMode && this.invitationId) {
        // Update logic
        const updatedInvitation = { ...invitationData, id: this.invitationId };
        this.service.updateClubInvitation(updatedInvitation).subscribe({
          next: () => {
            this.router.navigate(['/club-invitation']);
          },
          error: (err) => {
            console.error('Error updating invitation:', err);
          },
        });
      } else {
        // Create logic
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
}
