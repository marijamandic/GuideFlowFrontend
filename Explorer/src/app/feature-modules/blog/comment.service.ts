import { HttpClient, HttpParams } from '@angular/common/http';
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

  getComments(id: string,userRole:string): Observable<PagedResults<Comment>> {
    const params = new HttpParams().set('id', id.toString());
    if(userRole==="tourist")
      return this.http.get<PagedResults<Comment>>(environment.apiHost + 'commentmanaging/comment', { params });
    else
      return this.http.get<PagedResults<Comment>>(environment.apiHost + 'commentview/comment', { params });
  }

  deleteComments(id:number):Observable<Comment>{
    return this.http.delete<Comment>(environment.apiHost+'commentmanaging/comment/'+id);
  }

  addComment(comment:Comment):Observable<Comment>{
    return this.http.post<Comment>(environment.apiHost+'commentmanaging/comment/',comment);
  }

  editComment(comment:Comment):Observable<Comment>{
    return this.http.put<Comment>(environment.apiHost+'commentmanaging/comment/'+comment.id,comment);
  }
}
