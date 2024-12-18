import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../model/post.model';
import { PostService } from '../post.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  postForm: FormGroup;
  imageBase64: string;
  user: User | undefined;
  @Output() postCreated = new EventEmitter<void>();

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageBase64: ['']
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    // Check if there's an 'id' in the route to load the post for editing
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadDraftPost(parseInt(postId));
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
      this.postForm.patchValue({
        imageBase64: this.imageBase64
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.savePost(1); // 1 for Published status
      this.postCreated.emit();
    }
  }

  onDraft(): void {
    if (this.postForm.valid) {
      this.savePost(0); // 0 for Draft status
      this.postCreated.emit();
    }
  }

  private loadDraftPost(id: number): void {
    this.postService.getPost(id, this.user?.role || '').subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          description: post.description,
          imageBase64: post.imageBase64 || ''
        });
        this.imageBase64 = post.imageBase64 || '';
      },
      error: (err) => console.error('Error loading draft post', err)
    });
  }

  private savePost(status: number): void {
    const post = this.postForm.value;
    post.userId = this.user?.id;
    post.publishDate = new Date().toISOString();
    post.status = status;

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      // Update existing post
      this.postService.updatePost(post, parseInt(postId)).subscribe({
        next: () => {
          console.log('Post updated successfully');
          this.router.navigate(['blog']);
        },
        error: (err) => {
          console.error('Error updating post', err);
        }
      });
    } else {
      // Create new post
      this.postService.addPost(post).subscribe({
        next: (response: Post) => {
          console.log('Post created successfully', response);
          this.router.navigate(['blog']);
        },
        error: (err) => {
          console.error('Error creating post', err);
        }
      });
    }
  }
}
