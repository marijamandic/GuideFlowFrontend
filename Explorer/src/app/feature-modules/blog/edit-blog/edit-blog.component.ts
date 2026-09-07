import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post, Status } from '../model/post.model';
import { environment } from 'src/env/environment';

@Component({
  selector: 'xp-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnChanges {
  @Input() postData: Post | null = null
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Post>();

  postForm: FormGroup;
  imageBase64: string = '';

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageBase64: ['']
    });
  }

  ngOnChanges() {
    if (this.postData) {
      this.imageBase64 = this.postData.imageBase64 || '';
      this.postForm.patchValue({
        title: this.postData.title,
        description: this.postData.description,
        imageBase64: this.imageBase64
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.postForm.patchValue({
          imageBase64: this.imageBase64,
          imageUrl: this.imageBase64
        });
      };
      reader.readAsDataURL(file);
    }
  }
  

  onDraft() {
    if (this.postData) {
      const updatedPost = {
        ...this.postData,
        ...this.postForm.value,
        imageBase64: this.postForm.value.imageBase64 || this.imageBase64 || this.postData.imageBase64,
        imageUrl: this.postForm.value.imageBase64 || this.imageBase64 || this.postData.imageUrl, 
        status: Status.Draft,
      };
      this.saved.emit(updatedPost);
    }
  }
  
  onSubmit() {
    if (this.postData) {
      const updatedPost = {
        ...this.postData,
        ...this.postForm.value,
        imageBase64: this.postForm.value.imageBase64 || this.imageBase64 || this.postData.imageBase64,
        imageUrl: this.postForm.value.imageBase64 || this.imageBase64 || this.postData.imageUrl,
        status: Status.Published,
      };
      this.saved.emit(updatedPost);
    }
  }

  getImagePath(imageUrl: string) {
      return environment.webRootHost + imageUrl;
    }
  
}
