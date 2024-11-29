import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model';
import { ClubPost } from '../../model/club-post.model';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ClubInvitation, ClubInvitationStatus } from '../../model/club-invitation.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ClubRequest, ClubRequestStatus } from '../../model/club-request.model';

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.css']
})
export class ClubInfoComponent implements OnInit {
  club: Club;
  clubPosts: ClubPost[] = [];
  shouldEdit: boolean = false;
  ownerId: number = 0;
  role: string = "";
  users: User[] = [];
  filteredUsers: User[] = [];
  showModal: boolean = false;
  searchTerm: string = "";
  selectedUser: User | null = null;
  invitations: ClubInvitation[] = [];
  isMember: boolean = false;
  isPending: boolean = false;
  ownerUsername: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
      this.role = user.role;
    });

    this.administrationService.getAllUsers().subscribe((users) => {
      this.users = users;
      this.filterUsers();
    });

    const clubId = Number(this.route.snapshot.paramMap.get('id'));
    if (clubId) {
      this.loadClubData(clubId);
      this.loadClubPosts();
      this.loadClubInvitations(clubId);
      this.loadMembershipStatus(clubId);
      this.checkPendingRequest(clubId, this.ownerId);
      this.loadOwnerUsername();
    }
  }

  loadMembershipStatus(clubId: number): void {
    this.administrationService.getAllClubMembers(clubId).subscribe(members => {
      this.isMember = members.some(member => member.userId === this.ownerId);
    });
  }

  loadOwnerUsername(): void {
    if (this.club?.ownerId) {
      this.administrationService.getUsername(this.club.ownerId).subscribe({
        next: (username) => {
          this.ownerUsername = username;
        },
        error: (err) => {
          console.error("Error fetching owner's username:", err);
        }
      });
    }
  }  
  
  checkPendingRequest(clubId: number, userId: number): void {
    this.administrationService.getClubRequestByUser(userId).subscribe({
      next: (requests) => {
        const filteredRequests = requests.filter(
          (request: ClubRequest) =>
            request.clubId === clubId &&
            request.status === ClubRequestStatus.PENDING
        );
        this.isPending = filteredRequests.length > 0;
      },
      error: (err) => {
        console.error("Error fetching club requests:", err);
        this.isPending = false;
      }
    });
  }

  loadClubInvitations(clubId: number): void {
    this.administrationService.getClubInvitationsByClubId(clubId).subscribe((invitations: ClubInvitation[]) => {
        this.invitations = invitations.filter(invite => invite.status === ClubInvitationStatus.PENDING);
        this.filterUsers();
    });
  }

  filterUsers(): void {
    if (!this.club || !this.club.id) {
      console.error("Club data is not loaded yet.");
      return;
    }
  
    const memberIds: number[] = [];
    const pendingUserIds: number[] = this.invitations.map(invite => invite.touristId);
  
    this.administrationService.getAllClubMembers(this.club.id).subscribe({
      next: (members) => {
        memberIds.push(...members.map(member => member.userId));
  
        this.filteredUsers = this.users.filter(user => {
          const shouldInclude =
            user.id !== this.ownerId && 
            !memberIds.includes(user.id) && 
            !pendingUserIds.includes(user.id) &&
            user.username.toLowerCase().includes(this.searchTerm.toLowerCase()); 
  
          return shouldInclude;
        });
      },
      error: (err) => {
        console.error("Error loading members for filtering:", err);
      }
    });
  }
  
  

  loadClubData(clubId: number): void {
    this.administrationService.getClubById(clubId).subscribe({
      next: (data) => {
        this.club = data;
        console.log('Club data loaded:', this.club);
        
        // Load the owner's username
        this.loadOwnerUsername();
      },
      error: (err) => {
        console.error('Error loading club data:', err);
      }
    });
  }  

  loadClubPosts(): void {
    this.administrationService.getClubPosts().subscribe((posts) => {
      this.clubPosts = posts.filter(post => post.clubId === this.club.id);
    });
  }

  openInviteModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  searchUsers(): void {
    this.filteredUsers = this.users
      .filter(user => 
        user.id !== this.ownerId &&                
        !this.invitations.some(invite => invite.touristId === user.id && invite.status === ClubInvitationStatus.PENDING)
      )
      .filter(user => user.username.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onInvite(): void {
    if (this.selectedUser) {
      const invitation: ClubInvitation = { clubId: this.club.id!, touristId: this.selectedUser.id, status: ClubInvitationStatus.PENDING };
      this.administrationService.addClubInvitation(invitation).subscribe({
        next: () => {
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== this.selectedUser!.id);
          this.users = this.users.filter(user => user.id !== this.selectedUser!.id);
          this.selectedUser = null;
          console.log("User invited successfully!");
          this.filterUsers();
        },
        error: (err) => console.error("Error inviting user:", err)
      });
    } else {
      alert("Please select a user to invite.");
    }
  }

  getImagePath(imageUrl: string) {
    return environment.webRootHost + imageUrl;
  }

  onEditClub(): void {
    this.shouldEdit = true;
    this.router.navigate(['new-club'], { state: { club: this.club, shouldEdit: this.shouldEdit } });
  }

  onDashboard(): void {
    if (this.club?.id) {
      this.router.navigate([`/club-dashboard/${this.club.id}`]);
    } else {
      console.error("Club ID is undefined. Cannot navigate to dashboard.");
    }
  }  

  onRequestClub(): void {
    if (!this.isMember && !this.isPending && this.club?.id && this.ownerId) {
      const clubRequest: ClubRequest = {
        clubId: this.club.id,
        touristId: this.ownerId,
        status: ClubRequestStatus.PENDING, 
      };
  
      this.administrationService.addRequest(clubRequest).subscribe({
        next: () => {
          this.isPending = true;
          console.log("Request to join the club submitted successfully.");
        },
        error: (err) => console.error("Error submitting club request:", err),
      });
    }
  }

  selectUser(user: User): void {
    this.selectedUser = this.selectedUser?.id === user.id ? null : user;
  }

  
}

function mapStatusToEnum(status: string): ClubRequestStatus {
  switch (status) {
    case "PENDING":
      return ClubRequestStatus.PENDING;
    case "ACCEPTED":
      return ClubRequestStatus.ACCEPTED;
    case "DECLINED":
      return ClubRequestStatus.DECLINED;
    case "CANCELLED":
      return ClubRequestStatus.CANCELLED;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}

