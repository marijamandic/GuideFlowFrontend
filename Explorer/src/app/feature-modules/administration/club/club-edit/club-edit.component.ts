import { Component, OnInit,OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup,Validators,FormControl } from '@angular/forms';
import { AdministrationService } from '../../administration.service';
import { environment } from 'src/env/environment';
import { Club } from '../../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
@Component({
  selector: 'xp-club-edit',
  templateUrl: './club-edit.component.html',
  styleUrls: ['./club-edit.component.css']
})
export class ClubEditComponent implements OnInit,OnChanges{

  constructor(private service: AdministrationService, private authService: AuthService) {}
  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageBase64: new FormControl('',[Validators.required]),
  });
  imageBase64: string;
  @Input() clubId: number;
  ownerId: number = 0;
  isEditingEnabled: boolean = false;
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
    });
    if (this.clubId) {
      this.service.getClubById(this.clubId).subscribe({
        next: (result: Club) =>{
          this.clubForm.patchValue(result);
        },
        error: (err: any) => {
          console.log(err)
        }
      })
      console.log(`Editing club with ID: ${this.clubId}`);
    }
  }
  ngOnChanges(): void {
    
    
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.clubForm.patchValue({
        imageBase64: this.imageBase64
      });
    };
    reader.readAsDataURL(file);
  }
  updateClub(): void {
    const club: Club = {
      id: this.clubId,
      ownerId: this.ownerId,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageBase64: this.clubForm.value.imageBase64 || "",
      imageUrl: this.clubForm.value.imageBase64 || "",
    };
    if(this.imageBase64 !== undefined){
      this.service.updateClub(club).subscribe({
        next: () => {
          console.log("Club updated!");
        } 
      });
    }
    else{
      console.log("ERROR");
    }
  }
  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  toggleEditing(): void {
    this.isEditingEnabled = !this.isEditingEnabled;
    if (!this.isEditingEnabled) {
      //this.clubForm.reset()
    }
  }
  isFormValid(): boolean {
    return this.clubForm.valid && this.imageBase64 !== undefined;
  }
}
