import { Component } from '@angular/core';

@Component({
	selector: 'xp-bundle',
	templateUrl: './bundle.component.html',
	styleUrls: ['./bundle.component.css']
})
export class BundleComponent {
	constructor(private location: Location) {}
}
