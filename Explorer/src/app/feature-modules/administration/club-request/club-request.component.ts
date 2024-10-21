import { Component, OnInit } from '@angular/core';
import { ClubRequest } from '../model/club-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-club-request',
  templateUrl: './club-request.component.html',
  styleUrls: ['./club-request.component.css']
})

export class ClubRequestComponent implements OnInit {

  clubRequest: ClubRequest[] = []
  selectedRequest: ClubRequest;
  shouldEdit: boolean;
  shouldRenderRequestForm: boolean = false; 


  constructor(private service: AdministrationService) { }

  ngOnInit(): void{
    this.getClubRequest();
  }

  getClubRequest(): void {
    this.service.getClubRequest().subscribe({
      next: (result: PagedResults<ClubRequest>) =>{
        this.clubRequest = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }


  onEditClicked(clubRequest: ClubRequest): void{
    this.shouldEdit = true;
    this.selectedRequest = clubRequest;
  }

  onAddClicked(): void {
    this.shouldRenderRequestForm = true;
    this.shouldEdit = false;
  }

  deleteRequest(clubRequest: ClubRequest): void{
    /*this.service.deleteRequest(clubRequest).subscribe({
      next: (_) => {
        this.getRequest();
      }
    })
    */
  } 
}
