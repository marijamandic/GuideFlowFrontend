import { Component, OnInit } from '@angular/core';
import { ClubInvitation, ClubInvitationStatus } from '../../model/club-invitation.model';
import { ClubRequest, ClubRequestStatus } from '../../model/club-request.model';
import { ClubMemberList } from '../../model/club-member-list.model';
import { AdministrationService } from '../../administration.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { LayoutService } from 'src/app/feature-modules/layout/layout.service';
import { Notification, NotificationType } from 'src/app/feature-modules/layout/model/Notification.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xp-club-dashboard',
  templateUrl: './club-dashboard.component.html',
  styleUrls: ['./club-dashboard.component.css']
})
export class ClubDashboardComponent implements OnInit {
  members: (ClubMemberList & { username?: string; firstName?: string; lastName?: string ; joinedDate?: Date})[] = [];
  requests: (ClubRequest & { username?: string; firstName?: string; lastName?: string })[] = [];
  invitations: (ClubInvitation & { username?: string; firstName?: string; lastName?: string })[] = [];
  clubId: number;
  ownerId: number = 0;
  ownerName: string = "";

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageBase64: new FormControl('', [Validators.required]),
  });
  imageBase64: string;
  imageUrl: string = '';
  isEditingEnabled: boolean = false;
  memberCount: number;
  

  constructor(
    private service: AdministrationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: LayoutService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.clubId = +params['id'];

      this.authService.user$.subscribe(user => {
        this.ownerId = user.id;
        this.ownerName = user.username;
      });
      
      if (!this.clubId || isNaN(this.clubId)) {
        console.error('Invalid clubId:', this.clubId);
        return;
      }
  
      this.loadClub();
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
    //I will make this works when people fixing the profile are done
    this.service.getProfileInfoByUserId(userId).subscribe({
      next: (profile) => {
        target.firstName = profile.firstName;
        target.lastName = profile.lastName;
        if(target.joinedDate){
          const date = new Date(target.joinedDate);
          target.joinedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
        }
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

  acceptRequest(request: ClubRequest & { username?: string; firstName?: string; lastName?: string }): void {
    this.service.acceptClubRequest(request.id || 0).subscribe({
      next: () => {
        console.log(`Request ${request.id} accepted.`);
        this.getMembershipRequests(); 
      },
      error: (err) => {
        console.error(`Error accepting request ${request.id}:`, err);
        this.getMembershipRequests(); 
      },
    });
    const newNotification: Notification = {
      id: 0,
      userId: request.touristId, // Postavite ID korisnika
      sender: this.ownerName, // Pošiljalac, može biti statički ili dinamički
      message: `The request for ${this.clubForm.value.name} has been accepted.`, // Poruka sa imenom kluba
      createdAt: new Date(), // Trenutno vreme
      isOpened: false, // Podrazumevano nije pročitano
      type: 2, // Tip je 2 (ClubNotification)
    };
    
    this.notificationService.createTouristNotifaction(newNotification).subscribe({
        next: () => {
            console.log('Notification successfully created');
        },
        error: (err) => {
            console.error('Error creating notification:', err);
        },
    });
  }
  
  declineRequest(request: ClubRequest & { username?: string; firstName?: string; lastName?: string }): void {
    this.service.declineClubRequest(request.id || 0).subscribe({
      next: () => {
        console.log(`Request ${request.id} declined.`);
        this.getMembershipRequests(); 
      },
      error: (err) => {
        console.error(`Error declining request ${request.id}:`, err);
        this.getMembershipRequests(); 
      },
    });

    const newNotification: Notification = {
      id: 0,
      userId: request.touristId, // Postavite ID korisnika
      sender: this.ownerName, // Pošiljalac, može biti statički ili dinamički
      message: `The request for ${this.clubForm.value.name} has been rejected.`, // Poruka sa imenom kluba
      createdAt: new Date(), // Trenutno vreme
      isOpened: false, // Podrazumevano nije pročitano
      type: 2, // Tip je 2 (ClubNotification)
    };
    
    this.notificationService.createTouristNotifaction(newNotification).subscribe({
        next: () => {
            console.log('Notification successfully created');
        },
        error: (err) => {
            console.error('Error creating notification:', err);
        },
    });
  } 

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      console.log('Base64 Image:', this.imageBase64);
      this.clubForm.patchValue({
        imageBase64: this.imageBase64,
      });
    };
    reader.readAsDataURL(file);
  }
  
  
  updateClub(): void {
    const club = {
      id: this.clubId,
      ownerId: this.ownerId,
      name: this.clubForm.value.name || '',
      description: this.clubForm.value.description || '',
      imageBase64: this.clubForm.value.imageBase64 || '',
      imageUrl: this.clubForm.value.imageBase64 || '',
      memberCount: this.memberCount || 0,
    };
  
    if (this.imageBase64 !== undefined) {
      this.service.updateClub(club).subscribe({
        next: () => {
          console.log('Club updated successfully');
          this.loadClub(); 
          this.toggleEditing();
        },
        error: (err) => {
          console.error('Error updating club:', err);
        },
      });
    } 
  }
  
  toggleEditing(): void {
    this.isEditingEnabled = !this.isEditingEnabled;
  }

  getImagePath(imageUrl: string): string {
    return environment.webRootHost + imageUrl;
  }
  
  isFormValid(): boolean {
    return this.clubForm.valid && this.imageBase64 !== undefined;
  }

  loadClub(): void {
    this.service.getClubById(this.clubId).subscribe({
      next: (result: any) => {
        console.log('Club data:', result);
        this.clubForm.patchValue(result);
        this.imageUrl = result.imageUrl; 
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  
}
