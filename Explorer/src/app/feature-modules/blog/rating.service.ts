import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Rating } from './model/rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
    providedIn: 'root'
})
export class RatingService {

    constructor(private http : HttpClient) { }


    getRatingById(postId: number): Observable<Rating[]>{
        const params = new HttpParams().set('postId', postId.toString());
        return this.http.get<Rating[]>(environment.apiHost + "blogRatingManaging/blogRating", { params })
    }

    postRating(rating: Rating): Observable<Rating> {
        return this.http.post<Rating>(environment.apiHost + "blogRatingManaging/blogRating", rating);
    }

    deleteRating(userId: number, postId: number): Observable<void> {
        const params = new HttpParams()
          .set('userId', userId.toString())
          .set('postId', postId.toString());
        return this.http.delete<void>(environment.apiHost + "blogRatingManaging/blogRating", { params });
    }

}