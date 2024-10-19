import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  posts : Post[];
  user : User | undefined;
  constructor(private postService : PostService ,private authService : AuthService ,private router : Router){}

  ngOnInit(): void {
      this.authService.user$.subscribe(user =>{
        this.user = user;
      })
      this.postService.getPosts().subscribe({
        next: (result: PagedResults<Post>)=>{
          this.posts = result.results;
        },
        error: (err : any)=>{
          console.log(err);
        }
      })
  }
  getStatusName(status: Status): string {
    return Status[status];  // Ovo vraća ime enum-a (Draft, Published, Closed)
  }
  getImagePath(imageUrl: string){
    return environment.webRootHost+imageUrl;
  }

  navigateToCreatePost(){
    this.router.navigate(['createBlog']);
  }
}
