import { Component, OnInit, Input} from '@angular/core';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from 'src/app/feature-modules/blog/model/comment.model'
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit{

  @Input() postId!: string;
  user: User | undefined;
  selectedComment: Comment;
  comments:Comment[]=[];
  shouldRenderCommentForm: boolean = false;
  shouldEdit: boolean = false;

  constructor (private service:CommentService,private authService: AuthService){ }

  ngOnInit(): void {
    console.log(this.postId);
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getComments();
  }

  deleteComments(id:number):void{
    this.service.deleteComments(id).subscribe({
      next:()=>{
        this.getComments();
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  getComments():void{
    this.shouldRenderCommentForm=false;
    this.shouldEdit=false;
    if(this.postId!==null && this.user){
      this.service.getComments(this.postId,this.user.role).subscribe({
        next:(result:PagedResults<Comment>)=>{
          this.comments=result.results;
        },
        error:(err:any)=>{
          console.log(err);
        }
      })
    }
  }

  onEditClicked(comment: Comment): void {
    this.selectedComment = comment;
    this.shouldRenderCommentForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit=false;
    this.shouldRenderCommentForm = true;
  }
  
}
