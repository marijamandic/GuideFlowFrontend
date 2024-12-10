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

  progressPercent: number = 0;
  minXp: number = 0;
  maxXp: number = 0;
  currentXp: number = 0;
  nameSurname: string = ''; 
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
          this.calculateProgress();
        }
      })
    }
  }
  getProfileInfoById(userId: number): void {
    if (userId) {
      this.service.getProfileInfoByUserId(userId).subscribe({
        next: (result: ProfileInfo) => {
          this.profileInfo = result;
          console.log('Fetched Profile Info:', this.profileInfo); // Provera
          this.nameSurname = `${this.profileInfo.firstName || ''} ${this.profileInfo.lastName || ''}`.trim();
        },
        error: (err: any) => {
          console.log("Error fetching profile info", err);
        }
      });
    }
  }
  
  getImagePath(imageUrl: string): string {
    const fullPath = environment.webRootHost + imageUrl;
    console.log('Generated Image Path:', fullPath); // Provera
    return fullPath;
  }
  
  calculateProgress() {
    if (this.tourist) {
      const level = this.tourist.level || 1;
      const xp = this.tourist.xp || 0;
  
      this.minXp = level * 20;
      this.maxXp = (level + 1) * 20;
      this.currentXp = this.minXp + xp;
  
      // Procenat za progress bar
      this.progressPercent = (xp / 20) * 100;
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
