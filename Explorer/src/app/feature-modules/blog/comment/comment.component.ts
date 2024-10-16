import { Component, OnInit } from '@angular/core';
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

  user: User | undefined;
  comments:Comment[]=[];

  constructor (private service:CommentService,private authService: AuthService){ }

  ngOnInit(): void {
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
    this.service.getComments().subscribe({
      next:(result:PagedResults<Comment>)=>{
        this.comments=result.results;
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
  }

  
}
