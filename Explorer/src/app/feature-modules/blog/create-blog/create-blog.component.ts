import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post, Status } from '../model/post.model';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit{
  postForm : FormGroup;
  imageBase64: string;
  statuses = Object.keys(Status).filter(key => isNaN(Number(key))).map(key => ({
    name: key,                // Prikaz imena statusa
    value: Status[key as keyof typeof Status]  // Integer vrednost
  }));
  user : User | undefined;

  constructor(private postService : PostService , private fb : FormBuilder , private router : Router , private authSevice : AuthService){}

  ngOnInit(): void {
      this.postForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        status: [Status.Draft, Validators.required],
        imageBase64: ['']
      });
      this.authSevice.user$.subscribe(user => {
        this.user = user;
      })
  }
  onFileSelected(event : any){
    const file : File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () =>{
      this.imageBase64 = reader.result as string;
      this.postForm.patchValue({
        imageBase64: this.imageBase64
      });
    }
    reader.readAsDataURL(file);
  }
  onSubmit(): void {
    if (this.postForm.valid) {
      const post = this.postForm.value;
      post.userId = this.user?.id;  // Assuming the user is logged in and has an ID of 1
      post.publishDate = new Date().toISOString();
      post.status = Number(post.status)
      console.log(post.status)
      this.postService.addPost(post).subscribe({
        next: (response : Post) => {
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
