import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CartPreviewService {
	isOpened$ = new BehaviorSubject<boolean>(false);

	constructor() {}

	open() {
		this.isOpened$.next(true);
	}

	close() {
		this.isOpened$.next(false);
	}

	toggle() {
		this.isOpened$.next(!this.isOpened$.value);
	}
}
