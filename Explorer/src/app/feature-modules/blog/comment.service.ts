import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from './model/comment.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }

  getComments():Observable<PagedResults<Comment>>{
    return this.http.get<PagedResults<Comment>>(environment.apiHost+'commentmanaging/comment')
  }
}
