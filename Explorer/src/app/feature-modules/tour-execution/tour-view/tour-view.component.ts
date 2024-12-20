import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourStatus } from '../../tour-authoring/model/tour.model';
import { TransportMode } from '../model/transportRating.model';
import { Level, TourSpecification } from '../model/tour-specification.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AdministrationService } from '../../administration/administration.service';
import { Sales } from '../model/sales.model';
import { Checkpoint } from '../../tour-authoring/model/tourCheckpoint.model';
import { environment } from 'src/env/environment';
import { AlertService } from '../../layout/alert.service';
import { Router } from '@angular/router';
import { ItemInput } from '../../marketplace/model/shopping-carts/item-input';
import { ProductType } from '../../marketplace/model/product-type';
import { ShoppingCartService } from '../../marketplace/shopping-cart.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WeatherCondition } from '../../tour-authoring/model/weatherCondition.model';
import { TourBundle } from '../../marketplace/model/tour-bundle.model';
import { CartPreviewService } from '../../layout/cart-preview.service';

@Component({
	selector: 'xp-tour-view',
	templateUrl: './tour-view.component.html',
	styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent implements OnInit {
	allTours: Tour[] = [];
	tours: Tour[] = [];
	allUsers: User[] = [];
	allSales: Sales[] = [];
	tourCheckpoints: Checkpoint[] = [];
	newTour: Tour = this.initializeTour();
	weatherRequirements: WeatherCondition = {
		  minTemperature: 0,
		  maxTemperature: 0,
		  suitableConditions: []
	};
	bundles: TourBundle[];

	tourSpecification: TourSpecification[] = [];
	public TransportMode = TransportMode;
	public userId: number;
	user: User;

	ts = {
		id: 0,
		userId: 0,
		level: Level.Easy,
		taggs: [] as string[],
		transportRatings: [
			{ rating: 0, transportMode: TransportMode.Walk },
			{ rating: 0, transportMode: TransportMode.Bike },
			{ rating: 0, transportMode: TransportMode.Car },
			{ rating: 0, transportMode: TransportMode.Boat }
		]
	};
	levels = Level;
	tagsInputValue: string = '';
	currentTourSpecId: number | undefined;
	initialMarkers: L.LatLng[] = [];
	latitude: number | null = null;
	longitude: number | null = null;
	searchDistance: number | null = null;
	openMap: boolean = false;
	currentView: string = 'published';
	isModalOpen = false; // Praćenje stanja modala
	currentImageIndex: number = 1; // Čuva trenutni indeks slike za svaku turu

	REGULAR_PRODUCT = 'regular';
	BUNDLE_PRODUCT = 'bundle';
	productType = this.REGULAR_PRODUCT;

	isOpened$: boolean;

	constructor(
		private service: TourExecutionService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private adminService: AdministrationService,
		private alertService: AlertService,
		private router: Router,
		private shoppingCartService: ShoppingCartService,
		private cartPreviewService: CartPreviewService
	) {}

	//constructor(private service: TourExecutionService, authService: AuthService, private cdr: ChangeDetectorRef, private adminService: AdministrationService) {
	//authService.user$.subscribe((user: User) => {
	//his.userId = user.id;
	//})
	//}

	ngOnInit(): void {
		this.subscribeUser();
		this.subscribeCartPreview();
		this.getTourSpecificationPromise();
		this.getAllTours();
		this.service.getAllSales().subscribe({
			next: (sales: Sales[]) => {
				this.allSales = sales;
			},
			error: (err: any) => {
				console.error('Error fetching sales:', err);
			}
		});

		this.adminService.getAllUsers().subscribe({
			next: (users: User[]) => {
				this.allUsers = users;
			},
			error: (err: any) => {
				console.log(err);
			}
		});

		this.getPublishedBundles();
	}

	private subscribeCartPreview() {
		this.cartPreviewService.isOpened$.subscribe(isOpened => (this.isOpened$ = isOpened));
	}

	private subscribeUser() {
		this.authService.user$.subscribe((user: User) => {
			this.userId = user.id;
			this.user = user;
		});
	}

	private getPublishedBundles = () => {
		this.service.getPublishedBundles().subscribe({
			next: (result: PagedResults<TourBundle>): void => {
				this.bundles = [
					...result.results.map(b => ({
						...b,
						tourIds: [...b.tourIds]
					}))
				];
				console.log(this.bundles);
			},
			error: (error: HttpErrorResponse) => console.log(error.message)
		});
	};

	onViewDetails(tour: Tour): void {
		console.log('View Details clicked for tour:', tour.name);
	}

	onEditTour(tour: Tour): void {
		console.log('Edit clicked for tour:', tour.name);
	}

	goToDetails(tour: Tour) {
		if (this.user.role === 'tourist') {
			this.router.navigate(['/tour-more-details', tour.id]);
		}
		if (this.user.role === 'author') {
			this.router.navigate(['/tourAuthorDetails', tour.id]);
		}
	}

	initializeTour(): Tour {
		return {
			id: 0,
			authorId: -1,
			name: '',
			description: '',
			price: 0,
			level: Level.Easy,
			status: TourStatus.Draft,
			lengthInKm: 0,
			averageGrade: 0.0,
			taggs: [],
			checkpoints: [],
			transportDurations: [],
			reviews: [],
			weatherRequirements: this.weatherRequirements || { 
				minTemperature: 0, 
				maxTemperature: 0, 
				suitableConditions: [] 
			}
		};
	}
	openModal(): void {
		this.isModalOpen = true;
	}

	closeModal(): void {
		this.isModalOpen = false;
		window.location.reload();
	}

	onSubmit(): void {
		console.log('Nova tura:', this.newTour);
		// Logika za dodavanje ture ili slanje podataka na backend
		this.closeModal();
	}

	getAllTours(): void {
		this.service.getAllTours().subscribe({
			next: (result: PagedResults<Tour>) => {
				if (this.user.role == 'author') {
					this.tours = result.results.filter(tour => tour.authorId === this.user.id);
					this.onCurrentViewChanged();
				}
				if (this.user.role == 'tourist') {
					this.allTours = result.results.filter(tour => tour.status === TourStatus.Published);
				}

				console.log(this.allTours);
				console.log(this.allTours[1].reviews);
			},
			error: (err: any) => {
				console.log(err);
			}
		});
	}

	getCheckpointsByTourId(id: number): void {
		const selectedTour = this.allTours.find(t => t.id === id);

		// Ako tura postoji, preuzmi njene checkpoint-ove
		if (selectedTour) {
			this.tourCheckpoints = selectedTour.checkpoints || [];
			console.log('dobavio sam checkpointe za turu', id);
			console.log(this.tourCheckpoints);
		} else {
			console.error('Tour not found with id:', id);
			this.tourCheckpoints = [];
		}
	}

	changeOpenMap(): void {
		if (this.openMap) {
			this.openMap = false;
		} else {
			this.openMap = true;
		}
	}

	onStatusChange(status: string): void {
		this.currentView = status; // Ažuriraj trenutni pogled
		this.onCurrentViewChanged(); // Pozovi metodu za filtriranje
	}

	onCurrentViewChanged(): void {
		if (this.currentView === 'draft') {
			this.allTours = this.tours.filter(tour => tour.status === TourStatus.Draft);
		} else if (this.currentView === 'published') {
			this.allTours = this.tours.filter(tour => tour.status === TourStatus.Published);
		} else if (this.currentView === 'archived') {
			this.allTours = this.tours.filter(tour => tour.status === TourStatus.Archived);
		} else {
			this.allTours = [...this.tours]; // Ako nema filtra, prikaži sve ture
		}
		console.log('sve ture nakon currentViewChanged', this.allTours);
	}

	archiveTour(event: MouseEvent, tour: Tour): void {
		event.stopPropagation();
		if (tour.id !== null && tour.id !== undefined) {
			this.service.changeStatus(tour.id, 'Archive').subscribe({
				next: () => {
					this.getAllTours();
				},
				error: (err: any) => {
					console.log(err);
				}
			});
		}
	}

	onPublish(event: MouseEvent, tour: Tour): void {
		event.stopPropagation();
		if (tour.id !== null && tour.id !== undefined) {
			console.log(tour.id);
			this.service.changeStatus(tour.id, 'Publish').subscribe({
				next: () => {
					console.log('promenjeno');
					this.getAllTours();
				},
				error: (err: any) => {
					if (err.status === 400) {
						//alert("You can't publish this tour!");
						this.alertService.showAlert('You cannot publish this tour yet', 'error', 5);
					}
					console.log(err);
				}
			});
		}
	}

	getUsernameByTouristId(touristId: number): string {
		const user = this.allUsers.find(u => u.id === touristId);
		return user ? user.username : 'Unknown User';
	}

	calculateAverageRating(reviews: { rating?: number }[]): number {
		if (reviews.length === 0) return 0;

		const validRatings = reviews
			.map(review => review.rating) // Uzimamo samo ocene
			.filter((rating): rating is number => rating !== undefined); // Filtriramo undefined vrednosti

		if (validRatings.length === 0) return 0;

		const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
		return totalRating / validRatings.length;
	}
	//**FILTER* */
	getFilteredTours(tourSpecification: TourSpecification): Tour[] {
		return this.allTours.filter(tour => {
			const matchesTags = tourSpecification.taggs.some(tag => tour.taggs.includes(tag));
			const matchesLevel = tour.level === tourSpecification.level;
			return matchesTags || matchesLevel;
		});
	}

	onFilterClicked(): void {
		this.createTourSpecification()
			.then(() => {
				if (this.tourSpecification && this.tourSpecification.length > 0) {
					const userSpec = this.tourSpecification[0];
					this.allTours = this.getFilteredTours(userSpec);
					console.log('Filtered Tours:', this.allTours);
				}
			})
			.catch(err => {
				console.error('Error creating tour specification:', err);
			});
	}

	//**TOUR SPECIFICATION* */
	async deleteTourSpecification(): Promise<void> {
		if (!this.currentTourSpecId) {
			console.error('Invalid tourSpecification id, cannot delete.');
			return;
		}

		console.log('Deleting tourSpecification with id:', this.currentTourSpecId);

		this.service.deleteTourSpecification({ id: this.currentTourSpecId } as TourSpecification).subscribe({
			next: _ => {
				console.log('Tour specification successfully deleted');
				this.tourSpecification = this.tourSpecification.filter(ts => ts.id !== this.currentTourSpecId);
				this.resetForm();
				this.ngOnInit();
			},
			error: err => {
				console.error('Error deleting tour specification:', err);
			}
		});
	}

	getTourSpecificationPromise(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.service.getTourSpecification(this.userId).subscribe({
				next: (result: TourSpecification) => {
					console.log('API response:', result);
					this.tourSpecification = [result];
					this.ts = {
						id: result.id ?? 0,
						userId: result.userId,
						level: result.level,
						taggs: result.taggs,
						transportRatings: result.transportRatings
					};
					this.currentTourSpecId = result.id;
					console.log('Tour Specification assigned:', this.tourSpecification);

					this.tagsInputValue = this.ts.taggs.join(', ');
					resolve();
				},
				error: (err: any) => {
					if (err.status === 404) {
						console.log('No tour specification found for this user.');
						resolve();
					} else {
						console.error('Error fetching tour specification:', err);
						reject(err);
					}
				}
			});
		});
	}

	getRatingByTransportMode(ratings: any[], mode: number): number {
		const rating = ratings.find(r => r.transportMode === mode);
		return rating ? rating.rating : 'No rating';
	}

	createTourSpecification(): Promise<void> {
		this.ts.userId = this.userId;
		const tagsArray = this.tagsInputValue.split(',').map(tag => tag.trim());
		this.ts.taggs = tagsArray;

		return new Promise((resolve, reject) => {
			this.service.addTourSpecification(this.ts).subscribe({
				next: (response: TourSpecification) => {
					console.log('TourSpecification successfully created:', response);
					this.tourSpecification.push(response);
					this.currentTourSpecId = response.id;
					resolve();
				},
				error: err => {
					console.error('Error creating TourSpecification:', err);
					reject(err);
				}
			});
		});
	}

	trackByIndex(index: number, item: any): number {
		return index;
	}

	resetForm(): void {
		this.ts = {
			id: 0,
			userId: this.userId,
			level: Level.Easy,
			taggs: [],
			transportRatings: [
				{ rating: 0, transportMode: TransportMode.Walk },
				{ rating: 0, transportMode: TransportMode.Bike },
				{ rating: 0, transportMode: TransportMode.Car },
				{ rating: 0, transportMode: TransportMode.Boat }
			]
		};

		this.tagsInputValue = '';
	}

	isFormEmpty(): boolean {
		return !this.ts.taggs.length || this.ts.level === Level.Easy;
	}

	async filterTours(): Promise<void> {
		const userSpec = this.tourSpecification[0];
		this.allTours = await this.getFilteredTours(userSpec);
		this.cdr.detectChanges();
	}

	async applyChanges(): Promise<void> {
		try {
			if (this.currentTourSpecId) {
				await this.deleteTourSpecification();
			}
			await this.createTourSpecification();
			await this.getTourSpecificationPromise();
			this.allTours = this.getFilteredTours(this.tourSpecification[0]);
			this.cdr.detectChanges();
		} catch (error) {
			console.error('Error applying changes:', error);
		}
	}
	//**SORTING***

	onSortChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;

		switch (value) {
			case 'price-asc':
				this.sortAscending(); // Sortiraj po ceni rastuće
				break;
			case 'price-desc':
				this.sortDescending(); // Sortiraj po ceni opadajuće
				break;
			case 'sales':
				this.sortBySales(); // Sortiraj po prodaji
				break;
			default:
				console.warn('Unknown sort option:', value);
		}
	}

	sortAscending(): void {
		this.allTours.sort((a, b) => {
			const aPrice = this.getCostFromPrice(a.price);
			const bPrice = this.getCostFromPrice(b.price);
			return aPrice - bPrice; // Rastuće sortiranje
		});
	}

	sortDescending(): void {
		this.allTours.sort((a, b) => {
			const aPrice = this.getCostFromPrice(a.price);
			const bPrice = this.getCostFromPrice(b.price);
			return bPrice - aPrice; // Opadajuće sortiranje
		});
	}

	sortByPrice(): void {
		this.allTours.sort((a, b) => {
			const aPrice = this.getCostFromPrice(a.price);
			const bPrice = this.getCostFromPrice(b.price);
			return aPrice - bPrice; // Podrazumevano sortiranje po ceni (rastuće)
		});
	}

	sortBySales(): void {
		if (this.allSales.length === 0) {
			console.warn('No sales data available for sorting.');
			return;
		}

		const sortedTours: Tour[] = [];
		const toursWithSales: Set<number> = new Set();

		// Dodaj ture koje su povezane sa Sales podacima
		for (const sale of this.allSales) {
			const matchingTours = this.allTours.filter(tour => tour.id !== undefined && sale.tourIds.includes(tour.id));
			matchingTours.forEach(tour => {
				if (tour.id !== undefined) {
					toursWithSales.add(tour.id);
				}
			});
			sortedTours.push(...matchingTours);
		}

		// Dodaj ture koje nisu povezane sa Sales podacima na kraj
		const toursWithoutSales = this.allTours.filter(tour => tour.id !== undefined && !toursWithSales.has(tour.id));
		sortedTours.push(...toursWithoutSales);

		// Ažuriraj listu tura
		this.allTours = sortedTours;
	}

	private getCostFromPrice(price: number): number {
		return price ?? 0;
	}

	//**SEARCH BY MAP* */
	onCoordinatesSelected(coordinates: { latitude: number; longitude: number }): void {
		console.log('Coordinates selected:', coordinates);
		this.latitude = coordinates.latitude;
		this.longitude = coordinates.longitude;
		this.searchTours();
	}
	onMarkerAdded(latlng: L.LatLng): void {
		console.log('New marker added at:', latlng);
	}
	onMapReset(): void {
		console.log('Map reset');
	}

	searchTours(): void {
		if (this.latitude !== null && this.longitude !== null && this.searchDistance !== null) {
			console.log('usao sam u search');
			this.service.searchTours(this.latitude, this.longitude, this.searchDistance).subscribe({
				next: (tours: Tour[]) => {
					this.allTours = tours;
					console.log('allTours iz search :', this.allTours);
				},
				error: (err: any) => {
					console.error('Error fetching search results:', err);
				}
			});
		} else {
			console.log('Please select a point on the map and enter a search distance.');
		}
	}

	/*startImageCarousel(): void {
    setInterval(() => {
      this.allTours.forEach(tour => {
        if (tour.checkpoints && tour.checkpoints.length > 0) {
          // Smenjuj slike samo za trenutnu turu
          this.currentImageIndex[tour.id] =
            (this.currentImageIndex[tour.id] + 1) % tour.checkpoints.length;
        }
      });
    }, 3000); // Interval od 3 sekunde
  }*/

	getImagePath(imageUrl: string | undefined) {
		return environment.webRootHost + imageUrl;
	}

	CurrencyMap = {
		0: 'RSD',
		1: 'EUR',
		2: 'USD'
	};

	LevelMap = {
		0: 'Easy',
		1: 'Advanced',
		2: 'Expert'
	};

	addToCart(tour: Tour) {
		let item = {
			type: ProductType.Tour,
			productId: tour.id,
			productName: tour.name,
			adventureCoin: tour.price
		} as ItemInput;
		this.shoppingCartService.addToCart(item).subscribe({
			next: () => this.cartPreviewService.open(),
			error: (error: HttpErrorResponse) => {
				if (error.status) alert('Item already in cart');
				else console.log(error.message);
			}
		});
	}

	handleProductTypeChange() {
		this.productType = this.productType === this.REGULAR_PRODUCT ? this.BUNDLE_PRODUCT : this.REGULAR_PRODUCT;
	}
}
