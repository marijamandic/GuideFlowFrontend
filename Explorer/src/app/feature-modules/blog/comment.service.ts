import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from './model/comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  getCommentCount(postId: string): Observable<number> {
    const params = new HttpParams().set('postId', postId);
    return this.http.get<number>(`${environment.apiHost}commentmanaging/comment/count`, { params });
  }

  getComments(postId: string): Observable<Comment[]> {
    const params = new HttpParams().set('postId', postId);
    return this.http.get<Comment[]>(`${environment.apiHost}commentmanaging/comment/all`, { params });
  }

  deleteComments(id: number): Observable<Comment> {
    return this.http.delete<Comment>(`${environment.apiHost}commentmanaging/comment/${id}`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiHost}commentmanaging/comment/`, comment);
  }

  editComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${environment.apiHost}commentmanaging/comment/${comment.id}`, comment);
  }

  getCommentCreator(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiHost}commentmanaging/comment/user/${id}`);
  }
}
