import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Post } from './model/post.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http : HttpClient) { }

  getPosts(userRole:string) : Observable<PagedResults<Post>> {
    if(userRole==="author")
      return this.http.get<PagedResults<Post>>(environment.apiHost+'blogManagement/post');
    else
      return this.http.get<PagedResults<Post>>(environment.apiHost+'postview/post');
  }

  getPost(id:number,userRole:string) : Observable<Post> {
    if(userRole==="author")
      return this.http.get<Post>(environment.apiHost+'blogManagement/post/'+id);
    else
      return this.http.get<Post>(environment.apiHost+'postview/post/'+id);
  }

  addPost(post: Post) : Observable<Post> {
    return this.http.post<Post>(environment.apiHost+'blogManagement/post',post);
  }
}
