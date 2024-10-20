import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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

  constructor(private service: AdministrationService, private authSerivce: AuthService) { }
  
  ngOnInit(): void {
    this.getClub();
    this.authSerivce.user$.subscribe(user => {
      this.idOfOwner = user.id;
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
  onEditClicked(club: Club) :void {
    this.selectedClub = club;
    this.shouldEdit = true;
    this.shouldRenderClubForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }
}
