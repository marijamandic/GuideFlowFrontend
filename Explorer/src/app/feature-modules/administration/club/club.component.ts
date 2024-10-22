import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { ClubRequestService } from '../club-request.service';
import { ClubRequest } from '../model/club-request.model';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  club: Club[] = [];
  selectedClub: Club;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  idOfOwner: number = 0;
  loggedTouristId: number = 0;

  constructor(private service: AdministrationService, private authSerivce: AuthService, private clubRequestService: ClubRequestService) { }
  
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
        this.clubRequestService.getClubRequest(this.loggedTouristId).subscribe({
          next: (res: any) => {
            this.club.forEach(c => {
                console.log(res)
                const clubRequests = res.filter((r: any) => r.clubId === c.id)
                const pendingRequest = clubRequests.some((req: any) => req.status === 0);
                c.requested = pendingRequest;
            })
            console.log(this.club)
          }
        })
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
  onEditClicked(club: Club) :void {
    this.selectedClub = club;
    this.shouldEdit = true;
    this.shouldRenderClubForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }
  getImagePath(imageUrl: string){
    //console.log(imageUrl);
    return environment.webRootHost+imageUrl;
  }

  request(club: Club): void {
    const clubRequest: ClubRequest = {
      id: -1,
      clubId: Number(club.id),
      status: 0,
      touristId: this.loggedTouristId
    }
    this.clubRequestService.post(clubRequest).subscribe({
      next: () => {
        console.log(`Request to join club ${club.id} has been sent.`);
        this.getClub();
      },
      error: (err) => {
        console.error('Error sending request:', err);
      }
    });
  }

  cancel(club: Club): void {
    //club.requested = false;
    this.clubRequestService.getClubRequest(this.loggedTouristId).subscribe({
      next: (res: any) => {
        const clubRequests = res.filter((r: any) => r.clubId === club.id);
  
        if (clubRequests.length > 0) {
          let pendingRequests = clubRequests.filter((req: any) => req.status === 0);
  
          if (pendingRequests.length > 0) {
            const requestToCancel = pendingRequests[0];
            
            this.clubRequestService.cancelClubRequest(requestToCancel.id).subscribe({
              next: () => {
                club.requested = false;
                console.log(`Pending club request for club ${club.id} has been canceled.`);
              },
              error: (err: any) => {
                console.error("Error canceling pending club request:", err);
              }
            });
          } else {
            console.log(`No pending club requests found for club ${club.id} to cancel.`);
          }
        } else {
          console.log(`No club requests found for club ${club.id} and tourist ${this.loggedTouristId}.`);
        }
      },
      error: (err: any) => {
        console.error("Error fetching club requests:", err);
      }
    });
    
  }


  
}
