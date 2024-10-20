import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit{
  postId: string | null = null;
  post: Post | null = null;
  user : User | undefined;
  constructor(private postService : PostService ,private authService : AuthService,private route: ActivatedRoute){}

  ngOnInit(): void {
      this.postId = this.route.snapshot.paramMap.get('id');
      console.log(this.postId);
      this.authService.user$.subscribe(user =>{
        this.user = user;
      })
      if(this.user && this.postId){
        this.postService.getPost(Number(this.postId),this.user.role).subscribe({
          next: (result:Post)=>{
            this.post = result;
          },
          error: (err : any)=>{
            console.log(err);
          }
        })
      }
  }

  getStatusName(status: Status): string {
    return Status[status];  // Ovo vraća ime enum-a (Draft, Published, Closed)
  }

  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }
}
