import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Post } from './model/post.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http : HttpClient) { }

  getPosts(userRole: string): Observable<Post[]> {
    const endpoint = userRole === 'author' ? 'blogManagement/post' : 'postview/post';
    return this.http.get<Post[]>(`${environment.apiHost}${endpoint}`).pipe(
      catchError((error) => {
        console.error('Error fetching posts:', error);
        return throwError(error);
      })
    );
  }
  
  // Post
  getPost(id:number,userRole:string) : Observable<Post> {
    if(userRole==="author")
      return this.http.get<Post>(environment.apiHost+'blogManagement/post/'+id);
    else
      return this.http.get<Post>(environment.apiHost+'postview/post/'+id);
  }

  addPost(post: Post) : Observable<Post> {
    return this.http.post<Post>(environment.apiHost+'blogManagement/post',post);
  }

  updatePost(post: Post,id:number) : Observable<Post> {
    return this.http.put<Post>(environment.apiHost+'blogManagement/post/'+id,post);
  }

  // Username
  getUsername(userId: number): Observable<string> {
    return this.http.get<{ username: string }>(`${environment.apiHost}user/username/${userId}`)
        .pipe(map(response => response.username)); // Extract the username from the response object
  }

  // EngagementStatus
  getEngagementStatus(postId: number): Observable<number> {
    // https://localhost:44333/api/postview/engagement/${postId}/status
    return this.http.get<number>(`${environment.apiHost}api/postview/engagement/${postId}/status`);
  }
  
}
