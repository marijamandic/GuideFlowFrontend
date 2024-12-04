import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { Follower } from '../model/follower.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})

export class ProfileInfoComponent implements OnInit{
  
  @Output() profileInfoUpdated = new EventEmitter<null>();

  profileInfo: ProfileInfo[] = [];
  selectedProfileInfo : ProfileInfo;
  followers: Follower[] = []
  shouldEdit: boolean;
  shouldRenderProfileInfoForm: boolean=false;
  public userId: number;
  imageUrl: string;
  imageBase64: string;
  isEditMode = false; 

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
      //this.shouldEdit = true;
      //this.shouldRenderProfileInfoForm = true;    
      this.isEditMode = !this.isEditMode; // Menja režim uređivanja
      this.service.updateProfileInfo(profileInfo).subscribe({
        next: () => {       
          this.profileInfoUpdated.emit();
          this.getProfileInfoById(this.userId); //  zbg slike - Ponovo učitajte podatke nakon ažuriranja
        }
      });
      console.log("izlazim");
  }

  onProfileInfoUpdated(): void {
    this.shouldRenderProfileInfoForm = false; // Zatvori formu nakon ažuriranja
  }

    getImagePath(imageUrl: string){
      return environment.webRootHost+imageUrl;
    }

    onFileSelected(event : any){
      const file : File = event.target.files[0];
      
      const reader = new FileReader();
      /*reader.onload = () =>{
        this.imageBase64 = reader.result as string;
        this.selectedProfileInfo.imageBase64 = this.imageBase64;
        this.profileInfo = [this.selectedProfileInfo]; // Prikazivanje ažurirane slike odmah u UI-u
        
        
      }*/

      reader.onload = () => {
        this.imageBase64 = reader.result as string;
    
        // Ažuriranje selektovanog profila
        this.selectedProfileInfo.imageBase64 = this.imageBase64;
    
        // Postavljanje privremenog URL-a na pi.imageUrl kako bi se odmah prikazala slika
       // this.selectedProfileInfo.imageUrl = this.imageBase64;
    
        // Osvežavanje liste za prikaz
        this.profileInfo = [this.selectedProfileInfo];

        /*this.profileInfo.patchValue({
          imageBase64: this.imageBase64
        });*/
      };
      reader.readAsDataURL(file);
    }
}
