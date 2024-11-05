import { Component, OnInit } from '@angular/core';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { environment } from 'src/env/environment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CommentService } from '../comment.service';
import { RatingService } from '../rating.service';
import { Rating } from '../model/rating.model';

@Component({
  selector: 'xp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  posts: Post[];
  draftsToShow: Post[] = [];
  publishedPostsToShow: Post[] = [];
  user: User | undefined;
  commentCounts: { [postId: number]: number } = {};
  ratingCounts: { [postId: number]: { positive: number; negative: number } } = {};
  loggedInUserId: number = 0;
  engagementStatuses: { [postId: number]: number } = {};
  selectedStatus: Status | '' = ''; // Holds the selected status for filtering
  statusOptions = [Status.Active, Status.Famous]; // Filter options for dropdown

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loggedInUserId = user.id;
      if (this.user) {
        this.postService.getPosts(this.user.role).subscribe({
          next: (result: Post[]) => {
            this.posts = result;
            console.log(result);
            this.draftsToShow = this.posts.filter(post => post.status === Status.Draft && post.userId === this.user?.id);
            this.publishedPostsToShow = this.posts.filter(post => post.status !== Status.Draft && post.status !== Status.Closed);
            this.draftsToShow.forEach(post => this.loadUsername(post));
            this.publishedPostsToShow.forEach(post => this.loadUsername(post));
            this.loadCommentCounts();
            this.loadRatingCounts();
            this.publishedPostsToShow.forEach(post => {
              this.postService.getEngagementStatus(post.id).subscribe({
                next: (status: number) => {
                  this.engagementStatuses[post.id] = status;
                },
                error: (err) => console.error(`Error fetching engagement status for post ${post.id}:`, err)
              });
            });            
            this.publishedPostsToShow.forEach(post => {
              this.ratingService.getRatingById(post.id).subscribe({
                next: (res: any) => {
                  const ratings = res.filter((r: any) => r.userId === this.loggedInUserId);
                  post.isRated = ratings.length > 0;
                  const positiveRating = ratings.some((rating: any) => rating.ratingStatus === 0)
                  post.isRatedPositively = positiveRating;
                }
              })
            })
          },
          error: (err: any) => console.error('Error fetching posts:', err)
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
  
  loadRatingCounts(): void {
    this.publishedPostsToShow.forEach(post => {
      this.ratingService.getRatingById(post.id).subscribe({
        next: (res: Rating[]) => {
          const positiveCount = res.filter(rating => rating.ratingStatus === 0).length;
          const negativeCount = res.filter(rating => rating.ratingStatus === 1).length;

          this.ratingCounts[post.id] = { positive: positiveCount, negative: negativeCount };
        },
        error: (err) => console.error(`Error loading ratings for post ${post.id}:`, err)
      });
    });
  }


  getNetRating(postId: number): number {
    const ratingCount = this.ratingCounts[postId];
    return (ratingCount ? ratingCount.positive - ratingCount.negative : 0);
  }
  filterPostsByStatus(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement)?.value; // Type cast and optional chaining
    this.selectedStatus = selectedValue ? Number(selectedValue) : ''; // Convert to number if not empty
  
    this.publishedPostsToShow = this.selectedStatus !== ''
      ? this.posts.filter(post => post.status === this.selectedStatus)
      : this.posts;
  }


  getStatusName(status: Status): string {
    return Status[status];  // Ovo vraća ime enum-a (Draft, Published, Closed)
  }

  loadCommentCounts(): void {
    if (!this.user || !this.user.role) {
      console.warn("User information is not available yet.");
      return;
    }
  
    // Load comment counts for all posts
    [...this.draftsToShow, ...this.publishedPostsToShow].forEach(post => {
      this.commentService.getCommentCount(post.id.toString()).subscribe({
        next: (count) => {
          this.commentCounts[post.id] = count;
        },
        error: (err) => console.error(`Error loading comment count for post ${post.id}:`, err)
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

  navigateToEditPost(postId: number){
    this.router.navigate(['/edit-post', postId]);
  }

  navigateToCreatePost() {
    this.router.navigate(['create-blog']);
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
      createdDate: new Date()
    }

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
      createdDate: new Date()
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
  
  getEngagementStatusLabel(postId: number): string {
    switch (this.engagementStatuses[postId]) {
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
