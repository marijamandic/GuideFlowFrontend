import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';
import {Profile} from './model/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "", location: { latitude: 0, longitude: 0 } });
  profileInfo$ = new BehaviorSubject<Profile>({id: 0, userId: 0, firstName: "", lastName: "", imageUrl: "", biography: "", moto: ""})
  //@Output() idOfUser: number = 0;

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
          this.setProfileInfo();
        })
      );
  }

  register(registration: Registration): Observable<AuthenticationResponse> {
    return this.http
    .post<AuthenticationResponse>(environment.apiHost + 'users', registration)
    .pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
        this.setProfileInfo();
      })
    );
  }

  logout(): void {
    console.log("Logging out.")
    this.router.navigate(['/home']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next({username: "", id: 0, role: "", location: {longitude: 0, latitude: 0} });
      }
    );
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
    this.setProfileInfo();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
      role: jwtHelperService.decodeToken(accessToken)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
      location: {
        latitude: jwtHelperService.decodeToken(accessToken).lat,
        longitude: jwtHelperService.decodeToken(accessToken).lng
      }
    };
    //this.idOfUser = +jwtHelperService.decodeToken(accessToken).id;
    //console.log(this.idOfUser);
    this.user$.next(user);
  }

  private setProfileInfo(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const profileInfo: Profile = {
      id: +jwtHelperService.decodeToken(accessToken).id,      userId: +jwtHelperService.decodeToken(accessToken).id,
      firstName: jwtHelperService.decodeToken(accessToken).name,
      lastName: jwtHelperService.decodeToken(accessToken).surname,
      imageUrl: "slika.jpg",
      biography: "bio",
      moto: "moto"
    };
    //this.idOfUser = +jwtHelperService.decodeToken(accessToken).id;
    //console.log(this.idOfUser);
    this.profileInfo$.next(profileInfo);
  }

  addProfile(profile: Profile): Observable<void> {
    return this.http.post<void>(environment.apiHost + 'administration/profileInfo', profile);
  }
  
}