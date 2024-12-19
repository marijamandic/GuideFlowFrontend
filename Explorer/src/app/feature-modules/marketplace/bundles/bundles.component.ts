import { Component, Input } from '@angular/core';
import { TourBundle } from '../model/tour-bundle.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
	selector: 'xp-bundles',
	templateUrl: './bundles.component.html',
	styleUrls: ['./bundles.component.css']
})
export class BundlesComponent {
	@Input() user: User;
	@Input() bundles: TourBundle[];

	getImageUrl(imageUrl: string): string {
		return `${environment.webRootHost}${imageUrl}`;
	}
}
