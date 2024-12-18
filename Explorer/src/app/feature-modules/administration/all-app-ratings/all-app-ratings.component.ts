import { Component, OnInit } from '@angular/core';
import { AppRating } from '../../layout/model/AppRating.model';
import { LayoutService } from '../../layout/layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
	selector: 'xp-all-app-ratings',
	templateUrl: './all-app-ratings.component.html',
	styleUrls: ['./all-app-ratings.component.css']
})
export class AllAppRatingsComponent implements OnInit {
	allAppRatings: AppRating[] = [];

	constructor(private appRatingService: LayoutService) {}

	ngOnInit(): void {
		this.appRatingService.getAppRatings(1, 10).subscribe({
			next: (response: PagedResults<AppRating>) => {
				this.allAppRatings = response.results;
				console.log(response);
			},
			error: err => {
				console.error('Error fetching app ratings', err);
			}
		});
	}
}
