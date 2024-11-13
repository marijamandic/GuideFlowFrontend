import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model';
import { ClubPost } from '../../model/club-post.model';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ClubInvitation } from '../../model/club-invitation.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.css']
})
export class ClubInfoComponent implements OnInit {
  club: Club;
  clubPosts: ClubPost[] = [];
  shouldEdit: boolean = false;
  ownerId : number = 0;
  role : string = "";
  users: User[] = [];
  filteredUsers: User[] = [];
  showModal: boolean = false;
  searchTerm: string = "";
  selectedUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private authService : AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
      this.role = user.role;
      console.log("Logged-in user:", user); 
    });
  
    this.administrationService.getAllUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
      console.log("Fetched users:", users); 
    });
  
    const clubId = Number(this.route.snapshot.paramMap.get('id'));
    if (clubId) {
      this.loadClubData(clubId);
      this.loadClubPosts();
    }
  }
  

  loadClubData(clubId: number): void {
    this.administrationService.getClubs().subscribe((data) => {
      this.club = data.results.find(club => club.id === clubId) || {} as Club;
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
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onInvite(): void {
    if (this.selectedUser) {
      const invitation: ClubInvitation = { clubId: this.club.id!, touristId: this.selectedUser.id, status: 0 };
      this.administrationService.addClubInvitation(invitation).subscribe({
        next: () => {
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== this.selectedUser!.id);
          this.users = this.users.filter(user => user.id !== this.selectedUser!.id);
          this.selectedUser = null;
          alert("User invited successfully!");
        },
        error: (err) => console.error("Error inviting user:", err)
      });
    } else {
      alert("Please select a user to invite.");
    }
  }

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  onEditClub(): void {
    this.shouldEdit = true;
    this.router.navigate(['new-club'], { state: { club: this.club, shouldEdit: this.shouldEdit } });
  }

  onIvnite(): void{
    console.log("Hello chatGPT, please fix this.");
  }

  onRequestClub(): void {
    this.router.navigate(['club-request/add']);
  }

  selectUser(user: User): void {
    this.selectedUser = this.selectedUser?.id === user.id ? null : user;
  }
}