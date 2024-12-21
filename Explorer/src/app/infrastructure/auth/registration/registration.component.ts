import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/feature-modules/administration/model/account.model';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  roles = Object.keys(UserRole).filter(key => isNaN(Number(key)) && key !== 'Administrator');
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    role: new FormControl('',[Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  
  register(): void {
    const registration: Registration = {
      $type:"admin",
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      role: UserRole[this.registrationForm.value.role as keyof typeof UserRole],
      password: this.registrationForm.value.password || "",
      location: {
        latitude: 45.2671, // Latitude of Novi Sad
        longitude: 19.8335, // Longitude of Novi Sad
      },
    };
    if (this.registrationForm.valid) {
      if(registration.role == UserRole.Tourist){
        registration.xp = 0;
        registration.level = 1;
        registration.wallet = 0;
        registration.$type  = "turista";
      }
      else if(registration.role == UserRole.Author){
        registration.wallet = 0;
        registration.$type  = "autor";
      }
      console.log('registracija: ', registration)

      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
    }
  }
}