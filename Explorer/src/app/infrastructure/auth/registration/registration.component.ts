import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';
import { User } from '../model/user.model';
import { Tourist } from 'src/app/feature-modules/tour-authoring/model/tourist';
import { TouristRegistraion } from '../model/touristRegister.model';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private touristService: AdministrationService
  ) {}

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      location: {
        latitude: 45.2671, // Latitude of Novi Sad
        longitude: 19.8335, // Longitude of Novi Sad
      }
    };
    const user: TouristRegistraion = {
      id: 0,
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      role: 2,
      location: {
        latitude: 45.2671, // Latitude of Novi Sad
        longitude: 19.8335, // Longitude of Novi Sad
      }
    }
    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
      this.touristService.createTourist(user).subscribe({
        next: (response) => {
          console.log('Tourist created successfully:', response);
          alert('Tourist created successfully!');
        },
        error: (error) => {
          console.error('Error creating tourist:', error);
          alert('Failed to create tourist. Please try again.');
        },
        complete: () => {
          console.log('Tourist creation process completed.');
        }
      });      
    }
  }
}