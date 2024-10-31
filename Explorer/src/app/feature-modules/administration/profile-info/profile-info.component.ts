import { Component, OnInit } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})

export class ProfileInfoComponent implements OnInit{

  profileInfo: ProfileInfo[] = [];
  selectedProfileInfo : ProfileInfo;
  shouldEdit: boolean;
  shouldRenderProfileInfoForm: boolean=false;
  public userId: number;

  constructor(private service : AdministrationService, private authService: AuthService) {
    this.authService.user$.subscribe((user : User) => {
      this.userId = user.id;
    });
  }

  ngOnInit(): void {
    this.getProfileInfoById(this.userId);
  }

  getProfileInfoById(userId: number) : void
  {
    this.service.getProfileInfoByUserId(userId).subscribe({
      next: (result: ProfileInfo) => {
        console.log("API response:", result);
        this.profileInfo = [result];
      },
      error: (err:any) => {
        console.log("Error fetching profile info", err);
      }
    });
  }

  onEditClicked(profileInfo: ProfileInfo): void {
    this.selectedProfileInfo = profileInfo;
    this.shouldEdit = true;
    this.shouldRenderProfileInfoForm = true;
  }  

  onProfileInfoUpdated(): void {
    this.shouldRenderProfileInfoForm = false; // Zatvori formu nakon ažuriranja
  }

    getImagePath(imageUrl: string){
      return environment.webRootHost+imageUrl;
    }
}
