import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { environment } from 'src/env/environment';
import { Follower } from '../model/follower.model';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  @Output() profileInfoUpdated = new EventEmitter<null>();

  progressPercent: number = 0;
  minXp: number = 0;
  maxXp: number = 0;
  currentXp: number = 0;
  nameSurname: string = '';
  profileInfo: ProfileInfo;
  selectedProfileInfo: ProfileInfo;
  followers: Follower[] = [];
  tourist: Tourist | undefined;
  shouldEdit: boolean = false;
  shouldRenderProfileInfoForm: boolean = false;
  userId: number = 0;
  imageUrl: string = '';
  imageBase64: string = '';
  isEditMode: boolean = false;
  followedProfiles: number[] = [];
  loggedInUser: User;
  loggedInProfile: ProfileInfo;
  isUserLoggedIn: boolean = true;
  isAuthor: boolean = false;
  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdministrationService,
    private tourService: TourService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.reloadComponent();
      }
    });

    this.initializeComponent();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private initializeComponent(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.userId) {
      this.isUserLoggedIn = false;
      return;
    }

    this.authService.user$.subscribe({
      next: (user) => {
        if (!user) {
          this.isUserLoggedIn = false;
        } else {
          this.loggedInUser = user;
          this.isAuthor = user.role === 'author';
          this.service.getProfileInfoByUserId(this.loggedInUser.id).subscribe({
            next: (profile) => {
              this.loggedInProfile = profile;
              console.log('Logged-in profile fetched:', this.loggedInProfile);
            },
            error: (err) => {
              console.error('Error fetching logged-in profile:', err);
            }
          });
        }
      },
      error: () => {
        this.isUserLoggedIn = false;
      }
    });

    if (this.isUserLoggedIn) {
      this.loadData(this.userId);
    }
  }

  private reloadComponent(): void {
    this.initializeComponent();
  }

  private loadData(userId: number): void {
    if (userId) {
      this.getProfileInfoById(userId);
      this.getTouristInfoById(userId);
      this.loadFollowedProfiles();
    }
  }

  getTouristInfoById(userId: number): void {
    if (userId) {
      this.tourService.getTouristById(userId).subscribe({
        next: (result: Tourist) => {
          this.tourist = result;
          this.calculateProgress();
        },
        error: (err: any) => {
          console.error('Error fetching tourist info', err);
        }
      });
    }
  }

  loadFollowedProfiles(): void {
    this.service.getFollowedProfiles(this.loggedInUser?.id).subscribe({
      next: (ids: number[]) => {
        this.followedProfiles = ids;
        console.log('Followed profiles:', this.followedProfiles);
      },
      error: (err: any) => {
        console.error('Error fetching followed profiles', err);
      }
    });
  }

  getProfileInfoById(userId: number): void {
    if (userId) {
      this.service.getProfileInfoByUserId(userId).subscribe({
        next: (result: ProfileInfo) => {
          this.profileInfo = result;
          console.log('Fetched Profile Info:', this.profileInfo);

          this.nameSurname = `${result.firstName || ''} ${result.lastName || ''}`.trim();

          this.followers = result.followers || [];
          console.log('Followers loaded:', this.followers);
        },
        error: (err: any) => {
          console.error('Error fetching profile info', err);
        }
      });
    }
  }




  calculateProgress(): void {
    if (this.tourist) {
      const level = this.tourist.level || 1;
      const xp = this.tourist.xp || 0;

      this.minXp = (level-1) * 20;
      this.maxXp = level * 20;
      this.currentXp = this.minXp + xp;

      this.progressPercent = (xp / 20) * 100;
    }
  }

  onEditClicked(profileInfo: ProfileInfo): void {
    this.selectedProfileInfo = profileInfo;
    this.isEditMode = !this.isEditMode;

    this.service.updateProfileInfo(profileInfo).subscribe({
      next: () => {
        this.profileInfoUpdated.emit();
        this.loadData(this.userId); 
      },
      error: (err: any) => {
        console.error("Error updating profile info", err);
      }
    });
  }

  onFollowButtonClick(followedId: number): void {
    const followerId = this.loggedInUser.id; 
    const followerUsername = this.loggedInUser.username; 
    const imageUrl = this.loggedInProfile?.imageUrl;
  
    this.service.followUser(followedId, followerId, followerUsername, imageUrl).subscribe({
      next: () => {
        console.log(`Uspešno zapraćen korisnik sa ID-jem ${followedId}`);
        this.loadData(this.userId); 
      },
      error: (err) => {
        console.error(`Greška pri pokušaju praćenja korisnika sa ID-jem ${followedId}:`, err);
        alert(`Greška: Nije moguće zapratiti korisnika sa ID-jem ${followedId}`);
      },
    });
  }
  

onEditOrSaveClicked(): void {
  if (this.isEditMode) {
    this.profileInfo.imageBase64 = this.imageBase64 || this.profileInfo.imageBase64;
    this.profileInfo.imageUrl = this.imageUrl || this.profileInfo.imageUrl;


    this.service.updateProfileInfo(this.profileInfo).subscribe({
      next: (updatedProfile) => {
        console.log('Profile updated successfully:', updatedProfile);
        this.profileInfo = updatedProfile; 
        this.isEditMode = false; 
        this.imageBase64 = ''; 
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });
  } else {
    this.isEditMode = true;
  }
}


getImagePath(imageUrl: string | undefined): string {
  if (imageUrl) {
    return `${environment.webRootHost}${imageUrl}`;
  }
  return '';
}


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
  
        if (this.selectedProfileInfo) {
          this.selectedProfileInfo.imageBase64 = this.imageBase64;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  
}
  
