import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { PostComponent } from './post/post.component';



@NgModule({
  declarations: [
    CommentComponent,
    PostComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CommentComponent,
    PostComponent
  ]
})
export class BlogModule { }
