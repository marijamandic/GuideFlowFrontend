import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnInit, OnChanges {
  
  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;
  ownerId: number = 0;
  imageBase64: string;

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageBase64: new FormControl(''),
  });

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set ownerId once when component initializes
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
    });
  }

  ngOnChanges(): void {
    this.clubForm.reset();
    if (this.shouldEdit && this.club) {
      this.clubForm.patchValue(this.club);
    }
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

  addClub(): void {
    const club: Club = {
      ownerId: this.ownerId,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageBase64: this.clubForm.value.imageBase64 || "",
      imageUrl: this.clubForm.value.imageBase64 || "",
    };
    this.service.addClub(club).subscribe({
      next: () => { this.clubUpdated.emit(); },
      error: (err) => { console.log(err); } 
    });
    this.router.navigate(['club']);
  }

  updateClub(): void {
    const club: Club = {
      id: this.club.id,
      ownerId: this.ownerId,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageBase64: this.clubForm.value.imageBase64 || "",
      imageUrl: this.clubForm.value.imageBase64 || "",
    };
    this.service.updateClub(club).subscribe({
      next: () => { this.clubUpdated.emit(); }
    });
    this.router.navigate(['club']);
  }

  onSubmit(): void {
    if (this.clubForm.valid) {
      if (this.shouldEdit) {
        this.updateClub();

      } else {
        this.addClub();
      }
    }
  }
}
