import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { Follower } from '../model/follower.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tourist } from '../../tour-authoring/model/tourist';
import { TourService } from '../../tour-authoring/tour.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})

export class ProfileInfoComponent implements OnInit{
  
  @Output() profileInfoUpdated = new EventEmitter<null>();

  profileInfo: ProfileInfo | undefined;
  selectedProfileInfo : ProfileInfo;
  followers: Follower[] = []
  tourist: Tourist | undefined;
  shouldEdit: boolean;
  shouldRenderProfileInfoForm: boolean=false;
  userId: number;
  imageUrl: string;
  imageBase64: string;
  isEditMode = false; 

  constructor(private route: ActivatedRoute, private service : AdministrationService, private authService: AuthService,private tourService: TourService) {
  }
  
  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProfileInfoById(this.userId);
    this.getTouristInfoById(this.userId);
  }
  getTouristInfoById(userId: number){
    if (userId){
      this.tourService.getTouristById(userId).subscribe({
        next: (result:Tourist) => {
          this.tourist = result;
          console.log(this.tourist)
        }
      })
    }
  }
  getProfileInfoById(userId: number) : void
  {
    if(userId){
      this.service.getProfileInfoByUserId(userId).subscribe({
        next: (result: ProfileInfo) => {
          this.profileInfo = result;
        },
        error: (err:any) => {
          console.log("Error fetching profile info", err);
        }
      });
    }
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
        this.profileInfo = this.selectedProfileInfo;

        /*this.profileInfo.patchValue({
          imageBase64: this.imageBase64
        });*/
      };
      reader.readAsDataURL(file);
    }
}
