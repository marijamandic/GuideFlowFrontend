import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from '../model/paged-results.model';
import { Club } from 'src/app/feature-modules/administration/model/club.model';
import { ClubMemberList } from 'src/app/feature-modules/administration/model/club-member-list.model';

@Component({
  selector: 'xp-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css']
})
export class ShareModalComponent implements OnInit {
  modalForm: FormGroup;
  user: User | undefined;
  sendToClub: boolean = false;
  followersMap: Map<number, string> = new Map(); // Mapa za praćenje followerId i followerUsername
  clubMap: Map<number, string> = new Map();
  selectedFollowerId: number | undefined = undefined; // Selektovani followerId
  selectedClubId: number | undefined = undefined; 
  @Input() postId!: number; // Prosleđeni ID posta
  @Input() isTour : boolean;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private service: AdministrationService, private authService: AuthService) {
    this.modalForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      selectedFollower: ['', Validators.required], // FormControl za selektovanje followera
      selectedClub: ['']
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitDescription() {
    if (this.modalForm.valid) {
      // Prosledjivanje selektovanog followera zajedno sa opisom
      this.submit.emit(`Description: ${this.modalForm.value.description}, FollowerId: ${this.selectedFollowerId}`);
    }
  }

  submitClubPost(){
    if (this.modalForm.valid && this.sendToClub) {
      this.submit.emit(`Description: ${this.modalForm.value.description}, ClubId: ${this.selectedClubId}`);
    }
  }

  onSendToClubChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.sendToClub = inputElement.checked;
  
    if (this.sendToClub) {
      this.modalForm.get('selectedFollower')?.clearValidators();
      this.modalForm.get('selectedClub')?.setValidators([Validators.required]);
  
      this.populateClubsMap(this.user?.id || 0);
    } else {
      this.modalForm.get('selectedClub')?.clearValidators();
      this.modalForm.get('selectedFollower')?.setValidators([Validators.required]);
    }
  
    this.modalForm.get('selectedFollower')?.updateValueAndValidity();
    this.modalForm.get('selectedClub')?.updateValueAndValidity();
  
    this.onCheckboxChange(); 
  }
  
  onCheckboxChange(): void {
    if (this.sendToClub) {
      this.modalForm.get('selectedFollower')?.reset();
    } else {
      this.modalForm.get('selectedClub')?.reset();
    }
  }
  

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if (this.postId) {
      this.loadPostDetails(this.postId);
    }
  }

  loadPostDetails(postId: number): void {
    console.log(postId);
    let IdOfUser = 0;
    if (this.user !== undefined) {
      IdOfUser = this.user.id;
    }
    this.service.getProfileInfoByUserId(IdOfUser).subscribe({
      next: (result: any) => {
        console.log(result);
        this.populateFollowersMap(result.followers); // Popunjavanje mape sa follower-ima
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    //this.populateClubsMap(IdOfUser);
  }

  populateFollowersMap(followers: any[]): void {
    this.followersMap.clear(); // Cistimo staru mapu pre nego sto popunimo novu
    followers.forEach(follower => {
      this.followersMap.set(follower.followerId, follower.followerUsername);
    });
  }

  populateClubsMap(userId: number): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        const usersClubs = result.results.filter(c => c.ownerId === userId).map(c => c.id); // Uzima id-eve gde je user owner
  
        this.service.getAllMembersByUserId(userId).subscribe({
          next: (clubs: ClubMemberList[]) => {
            const membershipClubs = clubs.map(c => c.clubId); // Uzima id-eve gde je user member
            const combinedClubIds = [...new Set([...usersClubs, ...membershipClubs])]; // Spajam dve liste i brisem duplikate
            
            this.clubMap.clear();
            combinedClubIds.forEach(clubId => {
              if(clubId)
              this.service.getClubById(clubId).subscribe({
                next: (club: Club) => {
                  this.clubMap.set(clubId, club.name);
                },
                error: (err) => {
                  console.error(`Failed to fetch club with ID ${clubId}:`, err);
                }
              });
            });
  
            console.log('Clubs Map:', this.clubMap);
          },
          error: (err) => {
            console.error('Error fetching membership clubs:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user clubs:', err);
      }
    });
  }
}

