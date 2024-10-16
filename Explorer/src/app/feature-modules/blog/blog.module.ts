import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post/post.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PostComponent,
    CreateBlogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [PostComponent , CreateBlogComponent]
})
export class BlogModule { }
