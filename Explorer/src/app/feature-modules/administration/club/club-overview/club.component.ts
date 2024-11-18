import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { ClubRequest } from '../../model/club-request.model';
import { Router } from '@angular/router';
import { ClubMemberList } from '../../model/club-member-list.model';
import { ClubInvitation } from '../../model/club-invitation.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  club: Club[] = [];
  members: ClubMemberList[] = [];
  invitations: ClubInvitation[] = [];
  potentialInvitees: Club[] = [];
  selectedClub: Club;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  idOfOwner: number = 0;
  loggedTouristId: number = 0;

  constructor(private service: AdministrationService,
    private authSerivce: AuthService,
    private router: Router,) { }
  
  ngOnInit(): void {
    this.getClub();
    this.authSerivce.user$.subscribe(user => {
      this.idOfOwner = user.id;
    })
    this.authSerivce.user$.subscribe(user => {
      this.loggedTouristId = user.id;
    })

  }

  getClub() : void{
    this.shouldRenderClubForm = false;
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) =>{
        this.club = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  
  deleteClub(id: number) : void{
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClub();
      }
    })
  }

  onAddClicked(): void {
    this.router.navigate(['new-club']);
  }

  navigateToClubInfo(clubId: number | undefined): void {
    if (clubId !== undefined) {
      this.router.navigate([`/club-info`, clubId]);
    }
  }
  
  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  
}
