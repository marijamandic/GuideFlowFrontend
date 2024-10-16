import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  posts : Post[];
  constructor(private postService : PostService , private router : Router){}

  ngOnInit(): void {
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

  navigateToCreatePost(){
    this.router.navigate(['createBlog']);
  }
}
