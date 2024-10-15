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

  constructor(private service: AdministrationService) { }
  ngOnInit(): void {
    this.service.getClubRequest().subscribe({
      next: (result: PagedResults<ClubRequest>) =>{
        this.clubRequest = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

}
