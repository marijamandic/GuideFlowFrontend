import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { PostComponent } from './post/post.component';
import { RouterModule } from '@angular/router';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { MarkdownModule } from 'ngx-markdown';
import { PostInfoComponent } from './post-info/post-info.component';



@NgModule({
  declarations: [
    CommentComponent,
    PostComponent,
    CreateBlogComponent,
    CommentFormComponent,
    PostInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot()
  ],
  exports:[
    CommentComponent,
    PostComponent,
    CreateBlogComponent,
    CommentFormComponent,
    PostInfoComponent
  ]
})
export class BlogModule { }
