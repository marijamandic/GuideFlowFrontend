import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { CommentService } from '../comment.service';
import { Comment } from '../model/comment.model'; 
import { environment } from 'src/env/environment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit {
  postId: string | null = null;
  post: Post | null = null;
  user: User | undefined;
  comments: (Comment & { username?: string })[] = [];
  commentCount: number = 0;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if (this.postId) {
      this.loadPost();
      this.loadComments();
    }
  }

  loadPost(): void {
    if (this.user && this.postId) {
      this.postService.getPost(Number(this.postId), this.user.role).subscribe({
        next: (result: Post) => {
          this.post = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  loadComments(): void {
    if (this.postId) {
      this.commentService.getComments(this.postId, 'tourist').subscribe({
        next: (result) => {
          this.comments = result.results;
          this.commentCount = this.comments.length;
          this.comments.forEach(comment => {
            this.commentService.getCommentCreator(comment.userId).subscribe({
              next: (user) => {
                (comment as any).username = user.username; // Add username dynamically
              },
              error: (err) => console.error('Error fetching username:', err)
            });
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  

  deleteComment(commentId: number): void {
    this.commentService.deleteComments(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err: any) => {
        console.log('Failed to delete comment:', err);
      }
    });
  }
  

  getStatusName(status: Status): string {
    return Status[status];
  }

  get postStatus(): Status | undefined {
    return this.post ? this.post.status : undefined;
  }

  getImagePath(imageUrl: string): string {
    return `${environment.webRootHost}${imageUrl}`;
  }

  closePost(): void {
    if (this.post && this.postId) {
      this.post.status = Status.Closed;

      this.postService.updatePost(this.post, Number(this.postId)).subscribe({
        next: () => {
          this.router.navigate(["blog"]);
        },
        error: (err: any) => {
          console.error('Failed to update post status', err);
        }
      });
    }
  }
}
