import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ClubPost, ResourceType } from '../model/club-post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club-post',
  templateUrl: './club-post.component.html',
  styleUrls: ['./club-post.component.css']
})

export class ClubPostComponent implements OnInit {
  clubPosts : ClubPost[] = [];

  content: string = '';
  resource: string = '';
  public userId: number;
  public resursId: number;
  public resursTip: ResourceType;

  clubPostForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
    resource: new FormControl('', [Validators.required])
  })

  constructor(private service : AdministrationService, private authService: AuthService) {
    this.authService.user$.subscribe((user : User) => {
      this.userId = user.id;
    });
  }

  ngOnInit(): void {
    this.getClubPosts();
  }

  getClubPosts(): void {
    this.service.getClubPosts().subscribe({
      next: (result) => {
        this.clubPosts = result;
        console.log(result);
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  parseAttachmentLink(link: string) {
    const regex = /http:\/\/localhost:4200\/(blog|tour)\/(\d+)/;
    const match = link.match(regex);

    if (match && match[1] && match[2]) {
        return {
            resourceType: match[1], // This will be either "blog" or "tour"
            resursId: Number(match[2])
        };
    }

    return null;
  }

  addClubPost(): void {

    const parsedLink = this.parseAttachmentLink(this.clubPostForm.value.resource || "");
    const resourceType = parsedLink?.resourceType.toUpperCase() === "BLOG" ? 0 : 
                         parsedLink?.resourceType.toUpperCase() === "TOUR" ? 1 : 0;

    const clubPost: ClubPost = {
      clubId: 1,
      memberId: this.userId,
      content: this.clubPostForm.value.content || "",
      resourceId: parsedLink?.resursId || 0,
      resourceType: resourceType
    }

    this.service.addClubPost(clubPost).subscribe({
      next:(_) => {
        console.log("uspesno");
      }
    });
  }

}
