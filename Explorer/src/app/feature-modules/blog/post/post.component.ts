import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CommentService } from '../comment.service';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[];
  postsToShow: Post[];
  user: User | undefined;
  commentCounts: { [postId: number]: number } = {};

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
        this.user = user;
        if (this.user) { 
            this.postService.getPosts(this.user.role).subscribe({
                next: (result: PagedResults<Post>) => {
                    this.posts = result.results;
                    this.postsToShow = this.posts.filter(post => post.status !== Status.Closed);
                    this.postsToShow.forEach(post => this.loadUsername(post)); // Load username for each post
                    this.loadCommentCounts();
                },
                error: (err: any) => console.log(err)
            });
        }
    });
  }


  
  loadUsername(post: Post): void {
    console.log('Fetching username for post with userId:', post.userId);
    this.postService.getUsername(post.userId).subscribe({
        next: (username) => {
            console.log('Received username:', username);
            post.username = username;
        },
        error: (err) => console.error('Error loading username:', err)
    });
  }
 
  loadCommentCounts(): void {
    if (!this.user || !this.user.role) {
      console.warn("User information is not available yet.");
      return;
    }
  
    this.postsToShow.forEach(post => {
      this.commentService.getComments(post.id.toString(), 'tourist').subscribe({
        next: (result) => {
          this.commentCounts[post.id] = result.results.length;
        },
        error: (err) => console.error('Error loading comment count:', err)
      });
    });
  }
  

  getCommentCount(postId: number): number {
    return this.commentCounts[postId] || 0;
  }

  getImagePath(imageUrl: string) {
    return environment.webRootHost + imageUrl;
  }

  navigateToPostDetails(postId: number) {
    this.router.navigate(['/blog', postId]);
  }

  navigateToCreatePost() {
    this.router.navigate(['createBlog']);
  }

  upvote(postId: number) {}

  downvote(postId: number) {}
}
