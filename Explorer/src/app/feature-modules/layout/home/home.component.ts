import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../../marketplace/model/shopping-carts/shopping-cart';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { TourService } from '../../tour-authoring/tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AlertService } from '../alert.service';
import { LayoutService } from '../layout.service';
import { Club } from '../../administration/model/club.model';
import { TourPreview } from '../model/TourPreview';
import { Router } from '@angular/router';

@Component({
	selector: 'xp-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	images: string[] = ['assets/images/tour3.jpg', 'assets/images/ScreenshotFromReljasVlog1.jpg', 'assets/images/tour4.jpg'];
	currentImageIndex: number = 0;
	isTransitioning = false;
	user: User | undefined;
	shoppingCart: ShoppingCart | undefined;

	tours: TourPreview[] = [];
	clubs: Club[] = [];

	constructor(
		private authService: AuthService, 
		private layoutService: LayoutService, 
		private a: AlertService, 
		private router: Router) {}

	fallbackTours: TourPreview[] = [
		{
		id: 1,
		name: 'Fallback Tour 1',
		description: 'Explore breathtaking mountains and serene landscapes.',
		imageUrl: 'assets/images/tour1.jpg',
		meanRating: 0,
		numberOfRatings: 0

		},
		{
		id: 2,
		name: 'Fallback Tour 2',
		description: 'Discover hidden waterfalls and lush forests.',
		imageUrl: 'assets/images/tour2.jpg',
		meanRating: 0,
		numberOfRatings: 0

		},
		{
		id: 3,
		name: 'Fallback Tour 3',
		description: 'Immerse yourself in historical wonders and ancient ruins.',
		imageUrl: 'assets/images/tour3.jpg',
		meanRating: 0,
		numberOfRatings: 0

		},
		{
		id: 4,
		name: 'Fallback Tour 4',
		description: 'Walk along pristine beaches and turquoise waters.',
		imageUrl: 'assets/images/tour4.jpg',
		meanRating: 0,
		numberOfRatings: 0
		},
		{
		id: 5,
		name: 'Fallback Tour 5',
		description: 'Witness the dazzling northern lights in the Arctic.',
		imageUrl: 'assets/images/tour5.jpg',
		meanRating: 0,
		numberOfRatings: 0
		}
	];

	fallbackClubs: Club[] = [
		{
		id: 1,
		name: 'Fallback Club 1',
		description: 'A cozy place for explorers to connect and share experiences.',
		imageUrl: 'assets/images/default.jpg',
		ownerId: 0,
		imageBase64: '',
		memberCount: 0
		},
		{
		id: 2,
		name: 'Fallback Club 2',
		description: 'Join a community of adventurers with a passion for travel.',
		imageUrl: 'assets/images/default.jpg',
		ownerId: 0,
		imageBase64: '',
		memberCount: 0
		},
		{
		id: 3,
		name: 'Fallback Club 3',
		description: 'Meet locals and travelers at this vibrant club.',
		imageUrl: 'assets/images/default.jpg',
		ownerId: 0,
		imageBase64: '',
		memberCount: 0
		},
		{
		id: 4,
		name: 'Fallback Club 4',
		description: 'A hub for outdoor enthusiasts and nature lovers.',
		imageUrl: 'assets/images/default.jpg',
		ownerId: 0,
		imageBase64: '',
		memberCount: 0
		},
		{
		id: 5,
		name: 'Fallback Club 5',
		description: 'Network with like-minded adventurers in a relaxing atmosphere.',
		imageUrl: 'assets/images/default.jpg',
		ownerId: 0,
		imageBase64: '',
		memberCount: 0
		}
	];

	ngOnInit(): void {
		this.authService.user$.subscribe(user => {
		this.user = user;
		});
		this.startImageRotation();
		//this.loadTours();
		this.loadClubs();
		this.loadAllTours();
	}

	navigateToClub(clubId: number): void {
		this.router.navigate(['/club-info', clubId]);
	}

	loadAllTours(): void {
		this.layoutService.getAllTours().subscribe({
			next: (pagedResult: { results: Tour[], totalCount: number }) => {
				const { results } = pagedResult; // Extract the array of tours
				console.log('Received Tours Result:', results);
	
				this.tours = [];
	
				for (const tour of results) {
					// Extract ratings and calculate meanRating
					const ratings = tour.reviews?.map(review => review.rating).filter((rating): rating is number => rating !== undefined && rating !== null) || [];
					const meanRating = ratings.length > 0
						? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
						: 0;
	
					// Get the number of reviews
					const numberOfRatings = ratings.length;
	
					// Create a TourPreview object including meanRating and numberOfRatings
					const tourPreview: TourPreview = {
						id: tour.id || 0,
						name: tour.name || 'Unnamed Tour',
						description: tour.description || 'No description available.',
						imageUrl: tour.checkpoints?.[0]?.imageUrl || 'assets/images/default-tour.jpg',
						meanRating, // Add meanRating
						numberOfRatings, // Add numberOfRatings
					};
					if(tourPreview.numberOfRatings >= 3)
					{
						this.tours.push(tourPreview);
					}
				}
				
				// Sort the tours by meanRating in descending order
				this.tours.sort((a, b) => b.meanRating - a.meanRating);
	
				console.log("Mapped and Sorted Tour Previews with Ratings and Number of Ratings:", this.tours);
			},
			error: () => {
				console.error("Error loading tours");
				this.tours = this.fallbackTours; 
			}
		});
	}
	
	loadTours(): void {
		this.layoutService.getAllTourPreviews().subscribe({
			next: (result: TourPreview[]) => {
				this.tours = result.length ? result.slice(0, 5) : this.fallbackTours;
				console.log("LOADED TOURS")
			},
			error: () => {
				this.tours = this.fallbackTours;
				console.log("ERROR LOADING TOURS")
			}
		});
	}
	
	loadClubs(): void {
		this.layoutService.getTopClubs().subscribe({
		next: (result: Club[]) => {
			const clubsToDisplay = result.length >= 5 
			? result.slice(0, 5) 
			: [...result, ...this.fallbackClubs.slice(0, 5 - result.length)]; 
	
			this.clubs = clubsToDisplay.map(club => ({
			...club,
			imageUrl: this.layoutService.getImagePath(club.imageUrl), 
			}));
			//console.log(clubsToDisplay);
		},
		error: () => this.clubs = this.fallbackClubs, 
		});
	}
	
	startImageRotation() {
		setInterval(() => {
			this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
		}, 7000);
	}
}
