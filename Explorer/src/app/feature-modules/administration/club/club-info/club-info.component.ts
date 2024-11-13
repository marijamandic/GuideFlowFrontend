import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model';
import { ClubPost } from '../../model/club-post.model';

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.css']
})
export class ClubInfoComponent implements OnInit {
  club: Club;
  clubPosts: ClubPost[] = [];

  constructor(
    private route: ActivatedRoute,
    private administrationService: AdministrationService
  ) {}

  ngOnInit(): void {
    const clubId = Number(this.route.snapshot.paramMap.get('id'));
    if (clubId) {
      this.loadClubData(clubId);
      this.loadClubPosts();
    }
  }

  loadClubData(clubId: number): void {
    this.administrationService.getClubs().subscribe((data) => {
      this.club = data.results.find(club => club.id === clubId) || {} as Club;
    });
  }

  loadClubPosts(): void {
    this.administrationService.getClubPosts().subscribe((posts) => {
      this.clubPosts = posts.filter(post => post.clubId === this.club.id);
    });
  }

  getImagePath(imageUrl: string): string {
    return `https://your-cdn-path/${imageUrl}`;
  }
}