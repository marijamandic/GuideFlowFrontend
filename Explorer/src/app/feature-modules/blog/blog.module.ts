import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { PostComponent } from './post/post.component';
import { RouterModule } from '@angular/router';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { MarkdownModule } from 'ngx-markdown';
import { PostInfoComponent } from './post-info/post-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditBlogComponent } from './edit-blog/edit-blog.component';


@NgModule({
  declarations: [
    CommentComponent,
    PostComponent,
    CreateBlogComponent,
    CommentFormComponent,
    PostInfoComponent,
    EditBlogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MarkdownModule.forRoot(),
    SharedModule

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
