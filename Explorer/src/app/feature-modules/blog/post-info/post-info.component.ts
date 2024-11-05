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
import { RatingService } from '../rating.service';
import { Rating } from '../model/rating.model';

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
  openMenuId: number | null = null;
  loggedInUserId: number = 0;
  ratingCounts: { [postId: number]: { positive: number; negative: number } } = {};

  engagementStatus: number | null = null;


  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ratingService: RatingService
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loggedInUserId = user.id;
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
            this.loadEngagementStatus();
          }
          this.loadRatingCounts(this.post);
          this.loadRating(this.post);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  loadRatingCounts(post: Post): void {

    this.ratingService.getRatingById(post.id).subscribe({
        next: (res: Rating[]) => {
          const positiveCount = res.filter(rating => rating.ratingStatus === 0).length;
          const negativeCount = res.filter(rating => rating.ratingStatus === 1).length;

          this.ratingCounts[post.id] = { positive: positiveCount, negative: negativeCount };
        },
        error: (err) => console.error(`Error loading ratings for post ${post.id}:`, err)
      });
    
  }

  getNetRating(postId: number): number {
    const ratingCount = this.ratingCounts[postId];
    return (ratingCount ? ratingCount.positive - ratingCount.negative : 0);
  }
  loadEngagementStatus(): void {
    if (this.postId) {
      this.postService.getEngagementStatus(Number(this.postId)).subscribe({
        next: (status: number) => {
          console.log(status);
          this.engagementStatus = status;
        },
        error: (err) => console.error(`Error fetching engagement status for post ${this.postId}:`, err)
      });
    }
  }

  loadRating(post: Post): void{
    this.ratingService.getRatingById(post.id).subscribe({
      next: (res: any) => {
        const ratings = res.filter((r: any) => r.userId === this.loggedInUserId);
        post.isRated = ratings.length > 0;
        const positiveRating = ratings.some((rating: any) => rating.ratingStatus === 0)
        post.isRatedPositively = positiveRating;
      }
    })
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

  cancelEdit(): void {
    this.isEditing = false;
    this.editingComment = null;
    this.commentForm.reset();
  }

  getImagePath(imageUrl: string): string {
    return `${environment.webRootHost}${imageUrl}`;
  }

  toggleMenu(commentId?: number): void {
    if (commentId === undefined) {
      console.warn('Comment ID is undefined.');
      return;  
    }
    
    this.openMenuId = this.openMenuId === commentId ? null : commentId;
    console.log("Toggled menu for comment ID:", commentId);
    console.log("Current openMenuId:", this.openMenuId);
  }
  

  startEditingComment(comment: Comment): void {
    this.isEditing = true;
    this.editingComment = { ...comment };
    this.commentForm.patchValue({ content: comment.content });
    this.openMenuId = null;  // Close menu after selecting "Edit"
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComments(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (err) => console.error('Failed to delete comment:', err)
    });
    this.openMenuId = null;  
  }

  private addRating(rating: Rating, postId: number) {
      this.ratingService.postRating(rating).subscribe({
        next: () => {
          console.log(`Upvoted post ${postId}`);
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error upvoting:', err);
        }
      });
  }
  async upvote(postId: number) {
    const rating: Rating = {
      id: -1,
      ratingStatus: 0,
      userId: this.loggedInUserId,
      postId: postId,
      createdDate: new Date().toISOString()
    }


    console.log(rating.createdDate)
    const hasUpvoted = await this.findUpvote(this.loggedInUserId, postId);
    const hasDownvoted = await this.findDownvote(this.loggedInUserId, postId);

    if (hasUpvoted) {
      this.deleteRating(this.loggedInUserId, postId);
    } else {
      if (hasDownvoted) {
        await this.deleteRating(this.loggedInUserId, postId);
      }
      this.addRating(rating, postId);
    }
  }

  async downvote(postId: number) {
    const rating: Rating = {
      id: -1,
      ratingStatus: 1,
      userId: this.loggedInUserId,
      postId: postId,
      createdDate: new Date().toISOString()
    }

    const hasUpvoted = await this.findUpvote(this.loggedInUserId, postId);
    const hasDownvoted = await this.findDownvote(this.loggedInUserId, postId);

    if (hasDownvoted) {
      this.deleteRating(this.loggedInUserId, postId);
    } else {
      if (hasUpvoted) {
        await this.deleteRating(this.loggedInUserId, postId);
      }
      this.addRating(rating, postId);
    }
  }

  findUpvote(userId: number, postId: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.ratingService.getRatingById(postId).subscribe({
        next: (res: any) => {
          const sameRating = res.some((rating: any) => rating.userId === userId && rating.ratingStatus === 0);
          resolve(sameRating);
        },
        error: () => resolve(false)
      });
    });
  }

  findDownvote(userId: number, postId: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.ratingService.getRatingById(postId).subscribe({
        next: (res: any) => {
          const sameRating = res.some((rating: any) => rating.userId === userId && rating.ratingStatus === 1);
          resolve(sameRating);
        },
        error: () => resolve(false)
      });
    });
  }


  deleteRating(userId: number, postId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ratingService.deleteRating(userId, postId).subscribe({
        next: () => {
          console.log(`Deleted rating for post ${postId} by user ${userId}`);
          this.ngOnInit(); 
          resolve(); 
        },
        error: (err) => {
          console.error('Error deleting rating:', err);
          reject(err); 
        }
      });
    });
  }

  getEngagementStatusLabel(): string {
    switch (this.engagementStatus) {
      case 0:
        return 'Inactive';
      case 1:
        return 'Active';
      case 2:
        return 'Famous';
      case 3:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }  
  
}

