import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { environment } from 'src/env/environment';
import { SalesInput } from '../model/sales-input';
import { MarketplaceService } from '../marketplace.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'xp-create-sales-modal',
	templateUrl: './create-sales-modal.component.html',
	styleUrls: ['./create-sales-modal.component.css']
})
export class CreateSalesModalComponent implements OnInit {
	@Input() tours: Tour[];
	@Output() close = new EventEmitter<null>();
	@Output() created = new EventEmitter<null>();

	selectedTours: boolean[] = [];
	endsAt: string;
	discount: number;

	constructor(private marketplaceService: MarketplaceService) {}

	ngOnInit(): void {
		this.selectedTours = new Array(this.tours.length).fill(true);
	}

	handleCloseClick(): void {
		this.close.emit();
	}

	getImageUrl(url: string): string {
		return `${environment.webRootHost}${url}`;
	}

	calculateMaxEndsAt(): string {
		const today = new Date();
		const maxEndsAt = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
		return this.transformDate(maxEndsAt);
	}

	calculateMinEndsAt(): string {
		const today = new Date();
		const minEndsAt = new Date(today.getTime() + 24 * 60 * 60 * 1000);
		return this.transformDate(minEndsAt);
	}

	private transformDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	handleCheckboxClick(idx: number) {
		this.selectedTours[idx] = !this.selectedTours[idx];
	}

	handleCreateSale() {
		const sales = {
			endsAt: this.endsAt,
			discount: this.discount,
			tourIds: this.tours.filter((_, i) => this.selectedTours[i]).map(t => t.id)
		} as SalesInput;

		this.validateSalesInput();

		this.marketplaceService.createSales(sales).subscribe({
			next: _ => this.created.emit(),
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	}

	private validateSalesInput() {
		if (new Date(this.endsAt) <= new Date()) {
			alert('Invalid end date');
			return;
		}

		if (this.discount < 0 || this.discount > 100) {
			alert('Invalid discount');
			return;
		}

		if (this.tours.filter((_, i) => this.selectedTours[i]).map(t => t.id).length === 0) {
			alert('Must have atleast one tour selected');
			return;
		}
	}
}
