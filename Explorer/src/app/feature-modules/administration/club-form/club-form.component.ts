import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output,Input } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from '../model/club.model';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {
  
  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;
  ownerId: number = 0;
  imageBase64: string;

  constructor(private service: AdministrationService, private authService: AuthService) { }
  
  clubForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    imageBase64: new FormControl('',[Validators.required]),

  });
  onFileSelected(event : any){
    const file : File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () =>{
      this.imageBase64 = reader.result as string;
      this.clubForm.patchValue({
        imageBase64: this.imageBase64
      });
    }
    reader.readAsDataURL(file);
  }
  ngOnChanges(): void {
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
    })
    this.clubForm.reset();
    if(this.shouldEdit){
      this.clubForm.patchValue(this.club);
    }
  }
  addClub(): void{
    console.log(this.clubForm.value.imageBase64);
    const club: Club = {
      ownerId: this.ownerId,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageBase64: this.clubForm.value.imageBase64 || "",
      imageUrl: this.clubForm.value.imageBase64 || "",
    };
    this.service.addClub(club).subscribe({
      next: () => {this.clubUpdated.emit() }
    });
  }
  updateClub() : void {
    const club : Club = {
      ownerId: this.ownerId,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageBase64: this.clubForm.value.imageBase64 || "",
      imageUrl: this.clubForm.value.imageBase64 || "",
    };
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: () => {this.clubUpdated.emit();}
    });
  }
}

