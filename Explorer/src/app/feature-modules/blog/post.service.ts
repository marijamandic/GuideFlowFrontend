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

  getPosts() : Observable<PagedResults<Post>> {
    return this.http.get<PagedResults<Post>>(environment.apiHost+'blogManagement/post');
  }
  addPost(post: Post) : Observable<Post> {
    return this.http.post<Post>(environment.apiHost+'blogManagement/post',post);
  }
}
