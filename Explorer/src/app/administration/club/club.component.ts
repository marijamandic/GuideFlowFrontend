import { Component, OnInit } from '@angular/core';
import { Club } from '../model/club.model'; 
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {

  club: Club[] = [];

  constructor(private service: AdministrationService) { }
  ngOnInit(): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) =>{
        this.club = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
