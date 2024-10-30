import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../comment.service';
import { Comment } from 'src/app/feature-modules/blog/model/comment.model'
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnChanges{
  @Input() postId!: string;
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;

  userId: number = 0; 
  @Output() commentUpdated = new EventEmitter<null>();

  constructor(private service:CommentService,private authService:AuthService){}

  ngOnChanges(): void {
    this.commentForm.reset();
    if(this.shouldEdit) {
      this.commentForm.patchValue(this.comment);
    }
    this.authService.user$.subscribe(user => {
      if(user){
      this.userId = user.id;
      }
    });
  }

  commentForm=new FormGroup({
    content:new FormControl('',[Validators.required])
  })

  addComment():void{
    const comment: Comment = {
      content: this.commentForm.value.content || "",
      userId:this.userId,
      postId:Number(this.postId),
      createdAt:new Date(),
      lastModified:new Date(),
    };
    this.service.addComment(comment).subscribe({
      next: () => {
        this.commentUpdated.emit();
      }
    });
  }

  editComment(): void {
    const comment: Comment = {
      content: this.commentForm.value.content || "",
      userId:this.comment.userId,
      postId:this.comment.postId,
      createdAt:this.comment.createdAt,
      lastModified:new Date(),
    };
    comment.id=this.comment.id;
    this.service.editComment(comment).subscribe({
      next: () => { this.commentUpdated.emit();}
    });
  }

  cancelEdit(): void {
    this.commentForm.reset();
    this.shouldEdit = false;
    this.commentUpdated.emit(); // Emit event to refresh or reset view as needed
  }
  
}
