import { Component, OnInit } from '@angular/core';
import { ClubRequest, ClubRequestStatus } from '../model/club-request.model';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../administration.service';
import { ClubRequestService } from '../club-request.service'; // Make sure this service is imported
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club-request',
  templateUrl: './club-request.component.html',
  styleUrls: ['./club-request.component.css']
})
export class ClubRequestComponent implements OnInit {

  clubRequests: ClubRequest[] = [];
  clubs: Club[] = [];
  selectedRequest: ClubRequest;
  shouldEdit: boolean;
  shouldRenderRequestForm: boolean = false;
  loggedInUserId: number = 0;

  constructor(
    private service: AdministrationService, 
    private clubRequestService: ClubRequestService, // Inject ClubRequestService
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getClubs();
    this.authService.user$.subscribe(user => {
      this.loggedInUserId = user.id;
    });
  }
  
  getClubs(): void{
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) =>{
        this.clubs = result.results;
        this.getClubRequests();
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  getClubRequests(): void {
    this.service.getAllRequests().subscribe({
      next: (results: ClubRequest[]) => {
        this.clubRequests = results.filter(result =>
          this.clubs.some(club => club.id === result.clubId && club.ownerId === this.loggedInUserId)
        );
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getStatusLabel(status: ClubRequestStatus): string {
    switch (status) {
        case ClubRequestStatus.PENDING:
            return 'Pending';
        case ClubRequestStatus.ACCEPTED:
            return 'Accepted';
        case ClubRequestStatus.DECLINED:
            return 'Declined';
        case ClubRequestStatus.CANCELLED:
            return 'Cancelled';
        default:
            return 'Unknown';
    }
  }

  declineRequest(request: ClubRequest): void {
  
    if (request.id !== undefined && request.status === ClubRequestStatus.PENDING) {
      this.clubRequestService.declineClubRequest(request.id).subscribe({
          next: (updatedRequest) => {
              console.log('Request declined:', updatedRequest);
          },
          error: (err: any) => {
              console.error('Error declining request:', err);
          }
      });
  } else {
      console.error('Request ID is undefined, cannot decline request.');
  }
}

  
}
