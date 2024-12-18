import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { ProfileInfo } from '../model/profile-info.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-profile-info-form',
  templateUrl: './profile-info-form.component.html',
  styleUrls: ['./profile-info-form.component.css']
})

export class ProfileInfoFormComponent {

  @Output() profileInfoUpdated = new EventEmitter<null>();
  @Input() profileInfo: ProfileInfo;
  @Input() shouldEdit: boolean = false;
  @Input() shouldRenderProfileInfoForm: boolean;

  public userId: number;
  imageUrl: string;
  imageBase64: string;
  
  constructor(private service : AdministrationService, private authService: AuthService) {
    this.authService.user$.subscribe((user : User) => {
      this.userId = user.id;
    });
  }

  ngOnInit(): void {
    if (this.profileInfo) {
      this.profileInfoForm.patchValue({
        firstName: this.profileInfo.firstName,
        lastName: this.profileInfo.lastName,
        imageUrl: this.profileInfo.imageUrl,
        imageBase64: this.profileInfo.imageBase64,  
        biography: this.profileInfo.biography,
        moto: this.profileInfo.moto
      });
    }
  }
  
  profileInfoForm=new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      //profilePicture: new FormControl('', [Validators.required]),
      biography: new FormControl('', [Validators.required]),
      moto: new FormControl('', [Validators.required]),
      imageBase64: new FormControl(''),
      imageUrl: new FormControl('')
  }
  )

  updateProfileInfo() : void {
    if (!this.profileInfo) {
      console.log("Profile info is not set.");
      return;
    }
  
    console.log(this.profileInfoForm.value)
  
    const profileInfo : ProfileInfo = {
      userId: this.userId || 0,
      firstName: this.profileInfoForm.value.firstName || "",
      lastName: this.profileInfoForm.value.lastName || "",
      //profilePicture: this.profileInfoForm.value.profilePicture || "",
      imageUrl: this.profileInfoForm.value.imageUrl || "",
      imageBase64: this.profileInfoForm.value.imageBase64 || "",
      biography: this.profileInfoForm.value.biography || "",
      moto: this.profileInfoForm.value.moto || ""
    };
  
    profileInfo.id = this.profileInfo.id; // Provera da li profileInfo postoji pre pristupa id-u
  
    console.log("Profile Info ID:", profileInfo.id);
    console.log("User for update: ", profileInfo);
  
    this.service.updateProfileInfo(profileInfo).subscribe({
      next: () => { 
        this.profileInfoUpdated.emit();
      }
    });
    console.log("izlazim")
  }
  
  onFileSelected(event : any){
    const file : File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () =>{
      this.imageBase64 = reader.result as string;
      this.profileInfoForm.patchValue({
        imageBase64: this.imageBase64
      });
    }
    reader.readAsDataURL(file);
  }
  

}