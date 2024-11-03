import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  commentForm: FormGroup;
  isEditing = false;
  editingComment: Comment | null = null;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

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
                (comment as any).username = user.username;
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

  addComment(): void {
    const content = this.commentForm.value.content || '';
    if (this.user && this.postId && content) {
      const comment: Comment = {
        content: content,
        userId: this.user.id,
        postId: Number(this.postId),
        createdAt: new Date(),
        lastModified: new Date()
      };
      this.commentService.addComment(comment).subscribe({
        next: () => {
          this.loadComments();
          this.commentForm.reset();
        },
        error: (err) => console.error('Error adding comment:', err)
      });
    }
  }

  updateComment(): void {
    if (this.editingComment) {
      this.editingComment.content = this.commentForm.value.content || '';
      this.editingComment.lastModified = new Date();
      this.commentService.editComment(this.editingComment).subscribe({
        next: () => {
          this.loadComments();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating comment:', err)
      });
    }
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComments(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => console.log('Failed to delete comment:', err)
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingComment = null;
    this.commentForm.reset();
  }

  getImagePath(imageUrl: string): string {
    return `${environment.webRootHost}${imageUrl}`;
  }
}
