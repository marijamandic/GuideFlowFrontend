import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ActivatedRoute } from '@angular/router';
import { ClubMemberList } from '../model/club-member-list.model';

@Component({
  selector: 'xp-club-member-list',
  templateUrl: './club-member-list.component.html',
  styleUrls: ['./club-member-list.component.css']
})
export class ClubMemberListComponent implements OnInit {

  members: ClubMemberList[] = [];
  clubId: number;

  constructor(
    private service: AdministrationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.clubId = +params['clubId'];
        
        // Check if clubId is valid, if not, try to extract from the URL manually
        if (!this.clubId || isNaN(this.clubId)) {
            const url = window.location.href;
            const regex = /club-members\/(\d+)/; // Update the regex to match your route correctly
            const match = url.match(regex);

            if (match && match[1]) {
                this.clubId = +match[1];
            }
        }

        // Proceed to get club members if clubId is valid
        if (this.clubId && !isNaN(this.clubId)) {
            this.getClubMembers();
        } else {
            console.error('Invalid clubId');
        }
    });
  }

  getClubMembers(): void {
    this.service.getAllClubMembers(this.clubId).subscribe({
        next: (result: ClubMemberList[]) => {
            this.members = result;
            console.log('Loaded club members:', result);
        },
        error: (err: any) => {
            console.error('Error loading club members:', err);
        }
    });
  }

  kickMember(clubId: number, userId: number): void {
    this.service.removeClubMember(clubId, userId).subscribe({
      next: () => {
        console.log(`Member with ID ${userId} removed from club ${clubId}.`);
        // Refresh the member list after successful removal
        this.getClubMembers();
      },
      error: (err: any) => {
        console.error('Error removing club member:', err);
      }
    });
  }
}
