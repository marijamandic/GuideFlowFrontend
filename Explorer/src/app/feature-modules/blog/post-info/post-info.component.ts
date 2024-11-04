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
  authorName: string | undefined;
  comments: (Comment & { username?: string })[] = [];
  commentCount: number = 0;
  commentForm: FormGroup;
  isCommenting: boolean = false;
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
      this.loadCommentCount();
    }
  }

  loadPost(): void {
    if (this.user && this.postId) {
      this.postService.getPost(Number(this.postId), this.user.role).subscribe({
        next: (result: Post) => {
          this.post = result;
          if (this.post?.userId) {
            this.loadUsername(this.post.userId); 
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  loadCommentCount(): void {
    if (this.postId) {
      this.commentService.getCommentCount(this.postId).subscribe({
        next: (count: number) => {
          this.commentCount = count;
        },
        error: (err: any) => {
          console.error('Error loading comment count:', err);
        }
      });
    }
  }

  loadComments(): void {
    if (this.postId) {
      this.commentService.getComments(this.postId).subscribe({
        next: (comments: Comment[]) => {
          this.comments = comments;
          this.loadCommentUsernames();
        },
        error: (err: any) => {
          console.error('Error loading comments:', err);
        }
      });
    }
  }  

  loadUsername(userId: number): void {
    this.postService.getUsername(userId).subscribe({
      next: (username) => {
        this.authorName = username;
      },
      error: (err) => console.error('Error loading username:', err)
    });
  }

  loadCommentUsernames(): void {
    this.comments.forEach(comment => {
      this.commentService.getCommentCreator(comment.userId).subscribe({
        next: (user: User) => {
          comment.username = user.username; 
        },
        error: (err) => console.error('Error loading comment creator:', err)
      });
    });
  }

  toggleCommentForm(): void {
    this.isCommenting = !this.isCommenting;
    if (!this.isCommenting) {
      this.commentForm.reset();
    }
  }

  cancelComment(): void {
    this.isCommenting = false;
    this.commentForm.reset();
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
          console.log("Comment added.");
          this.loadComments();  
          this.commentForm.reset(); 
          this.toggleCommentForm();
          this.loadCommentCount();
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
