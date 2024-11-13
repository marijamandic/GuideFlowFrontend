import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { Club } from '../../model/club.model';
import { ClubPost } from '../../model/club-post.model';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'app-club-info',
  templateUrl: './club-info.component.html',
  styleUrls: ['./club-info.component.css']
})
export class ClubInfoComponent implements OnInit {
  club: Club;
  clubPosts: ClubPost[] = [];
  shouldEdit: boolean = false;
  ownerId : number = 0;

  constructor(
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private authService : AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.ownerId = user.id;
    });
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

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
  onEditClub(): void {
    this.shouldEdit = true;
    this.router.navigate(['new-club'], { state: { club: this.club, shouldEdit: this.shouldEdit } });
  }
  onRequestClub(): void {
    this.router.navigate(['club-request/add']);
  }
}