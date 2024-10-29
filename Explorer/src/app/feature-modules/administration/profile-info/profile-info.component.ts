import { Component, OnInit } from '@angular/core';
import { ProfileInfo } from '../model/profile-info.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model'

@Component({
  selector: 'xp-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})

export class ProfileInfoComponent implements OnInit{

  profileInfo: ProfileInfo[] = [];

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    this.service.getProfileInfo().subscribe({
      next: (result: PagedResults<ProfileInfo>) => {
        this.profileInfo = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

}
