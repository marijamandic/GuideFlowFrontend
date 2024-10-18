import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ClubInvitation } from '../model/club-invitation.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-club-invitation-form',
  templateUrl: './club-invitation-form.component.html',
  styleUrls: ['./club-invitation-form.component.css']
})
export class ClubInvitationFormComponent implements OnInit {
  @Input() invitation: ClubInvitation | null = null;
  @Input() isEditMode: boolean = false;
  @Output() formSubmit = new EventEmitter<ClubInvitation>();

  invitationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.invitationForm = this.fb.group({
      clubId: ['', Validators.required],
      touristId: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.invitation) {
      this.invitationForm.patchValue({
        clubId: this.invitation.clubId,
        touristId: this.invitation.touristId,
        status: this.invitation.status
      });
    }
    if (!this.isEditMode) {
      this.invitationForm.removeControl('status');
    }
  }
  

  onSubmit(): void {
    if (this.invitationForm.valid) {
      this.formSubmit.emit(this.invitationForm.value);
    }
  }
}
