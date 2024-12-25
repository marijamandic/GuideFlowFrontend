import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileInfoComponent } from 'src/app/feature-modules/administration/profile-info/profile-info.component';
import { EquipmentManagementComponent } from 'src/app/feature-modules/tour-execution/equipment-management/equipment-management.component';
import { TourObjectComponent } from 'src/app/feature-modules/tour-authoring/tour-object/tour-object.component';
import { CheckpointListComponent } from 'src/app/feature-modules/tour-authoring/tour-checkpoint/tour-checkpoint.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { ClubComponent } from 'src/app/feature-modules/administration/club/club-overview/club.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { PostComponent } from 'src/app/feature-modules/blog/post/post.component';
import { CreateBlogComponent } from 'src/app/feature-modules/blog/create-blog/create-blog.component';
import { PostInfoComponent } from 'src/app/feature-modules/blog/post-info/post-info.component';
import { RatingTheAppComponent } from 'src/app/feature-modules/layout/rating-the-app/rating-the-app.component';
import { AllAppRatingsComponent } from 'src/app/feature-modules/administration/all-app-ratings/all-app-ratings.component';
import { ClubFormComponent } from 'src/app/feature-modules/administration/club/club-form/club-form.component';
import { ClubInfoComponent } from 'src/app/feature-modules/administration/club/club-info/club-info.component';
import { NotificationsComponent } from 'src/app/feature-modules/layout/notifications/notifications.component';
import { PublicPointRequestsComponent } from 'src/app/feature-modules/tour-authoring/public-point-requests/public-point-requests.component';
import { TourReviewComponent } from 'src/app/feature-modules/tour-execution/tour-review/tour-review.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { PositionsimComponent } from 'src/app/feature-modules/tour-authoring/positionsim/positionsim.component';
import { TourExecutionDetailsComponent } from 'src/app/feature-modules/tour-execution/tour-execution-details/tour-execution-details.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
import { PublicPointNotificationsComponent } from 'src/app/feature-modules/tour-authoring/public-point-notifications/public-point-notifications.component';
import { TourExecutionMap } from 'src/app/feature-modules/tour-execution/tour-execution-map/tour-execution-map.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { ClubDashboardComponent } from 'src/app/feature-modules/administration/club/club-dashboard/club-dashboard.component';
import { TourBundleComponent } from 'src/app/feature-modules/marketplace/tour-bundle/tour-bundle.component';
import { CouponComponent } from 'src/app/feature-modules/marketplace/coupon/coupon.component';
import { TourBundlePreviewComponent } from 'src/app/feature-modules/marketplace/tour-bundle-preview/tour-bundle-preview.component';
import { EncounterComponent } from 'src/app/feature-modules/encounter-execution/encounter/encounter.component';
import { EncounterFormComponent } from 'src/app/feature-modules/encounter-execution/encounter-form/encounter-form.component';
import { AddEncounterComponent } from 'src/app/feature-modules/tour-authoring/add-encounter/add-encounter.component';
import { ExecutionComponent } from 'src/app/feature-modules/encounter-execution/execution/execution.component';
import { EncounterExecutionMapComponent } from 'src/app/feature-modules/encounter-execution/encounter-execution-map/encounter-execution-map.component';
import { AdminDashboardComponenet } from 'src/app/feature-modules/administration/admin-dashboard/admin-dashboard.component';
import { TourMoreDetailsComponent } from 'src/app/feature-modules/marketplace/tour-more-details/tour-more-details.component';
import { TourViewComponent } from 'src/app/feature-modules/tour-execution/tour-view/tour-view.component';
import { AuthorDashboardComponent } from 'src/app/feature-modules/administration/author-dashboard/author-dashboard.component';
import { TourAuthorDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-author-details/tour-author-details.component';
import { SuggestedToursComponent } from 'src/app/feature-modules/tour-execution/suggested-tours/suggested-tours.component';
import { ProblemInfoComponent } from 'src/app/feature-modules/tour-authoring/problem-info/problem-info.component';
import { BundleComponent } from 'src/app/feature-modules/marketplace/bundle/bundle.component';

const routes: Routes = [
	// ### Account stuff
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegistrationComponent },
	{ path: 'profile', component: ProfileInfoComponent }, // svaka čast onome ko je ovo radio je nije nigde bilo bindovano
	{ path: 'profile/:id', component: ProfileInfoComponent }, // svaka čast onome ko je ovo radio je nije nigde bilo bindovano

	// Admin // Ovo je buduci admin dashboard
	{ path: 'pending', component: PublicPointRequestsComponent }, // ovo treba spojiti sa admin-dashboard, za prihvatane tour objecta
	{ path: 'admin-dashboard', component: AdminDashboardComponenet },

	// ### Misc
	{ path: 'home', component: HomeComponent },
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'allAppRatings', component: AllAppRatingsComponent },
	{ path: 'position-sim', component: PositionsimComponent },
	{ path: 'position-sim/:tourExecutionId', component: PositionsimComponent },
	{ path: 'position-sim/:tourExecutionId/:encounterExecutionId', component: PositionsimComponent },

	// ### TOURS
	// --- /all-tours pregled svih tura (za s ve role), dodavanje tura, search tura
	{ path: 'all-tours', component: TourViewComponent },
	{ path: 'toursForAuthor', component: TourComponent }, // ovo treba spojiti u ovo iznad
	{ path: 'tourAuthorDetails/:id', component: TourAuthorDetailsComponent },
	{ path: 'purchased', component: PurchasedToursComponent }, // ovo treba napraviti da izgleda kao tours samo sto se druge ucitavaju
	{ path: 'tourBundlePreview/:id', component: TourBundlePreviewComponent }, // takođe treba spojiti u ono gore
	{ path: 'tourBundleManagement', component: TourBundleComponent }, // isto u ovo gore
	{ path: 'bundle', component: BundleComponent },

	// --- tour/:id pregled pojedinacne ture, dodavanje checkpointa, reviews, equpimentm, redirect na edit ture?
	{ path: 'tour/:id', component: TourDetailsComponent, children: [{ path: 'checkpoints/:tourId', component: CheckpointListComponent }] },
	{ path: 'checkpoints/:tourId', component: CheckpointListComponent }, // ovo spajamo u tours/:id
	{ path: 'tour-review/:tourId/:touristId', component: TourReviewComponent }, // ovo isto spajamo u tours/:id
	{ path: 'tour-more-details/:id', component: TourMoreDetailsComponent },

	// --- /tour-execution/:id
	{ path: 'tour-execution/:id', component: TourExecutionDetailsComponent }, // blizanac, blizanac

	// -- ne gde ovo uvezati u frontu
	//{ path: 'tour-preview/:id', component: TourPreviewComponent },
	{ path: 'tour-objects', component: TourObjectComponent, canActivate: [AuthGuard] },
	{ path: 'tourExecutionMap', component: TourExecutionMap },

	// --- ne znam šta spada u šta, treba mi pomoc
	{ path: 'tour-equipment/:id', component: TourEquipmentComponent },
	{ path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
	{ path: 'equipment-management', component: EquipmentManagementComponent },

	// --- report
	{ path: 'author-dashboard', component: AuthorDashboardComponent },
	{ path: 'problem-info/:id', component: ProblemInfoComponent },

	// ### Club
	{ path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
	{ path: 'club/:id', component: ClubInfoComponent, canActivate: [AuthGuard] },
	{ path: 'club-dashboard/:id', component: ClubDashboardComponent, canActivate: [AuthGuard] },
	{ path: 'new-club', component: ClubFormComponent, canActivate: [AuthGuard] },
	{ path: 'comment', component: CommentComponent },

	// ## Blog
	{ path: 'blog', component: PostComponent, canActivate: [AuthGuard] },
	{ path: 'blog/:id', component: PostInfoComponent, canActivate: [AuthGuard] },
	{ path: 'edit-post/:id', component: CreateBlogComponent },
	{ path: 'create-blog', component: CreateBlogComponent },

	// ## Encounter
	{ path: 'encounters', component: EncounterComponent },
	{ path: 'encounters/:encounterExecutionId/:tourExecutionId', component: EncounterComponent },
	{ path: 'encounter-add', component: EncounterFormComponent },
	{ path: 'encounter-update/:id', component: EncounterFormComponent },
	{ path: 'author-add-encounter/:id/:tourId', component: AddEncounterComponent },
	{ path: 'encounter-execution/:id', component: ExecutionComponent },
	{ path: 'encounter-execution/:id/:tourExecutionId', component: ExecutionComponent },
	{ path: 'encounterMap', component: EncounterExecutionMapComponent },
	{ path: 'suggested-tours/:longitude/:latitude', component: SuggestedToursComponent },

	// ## Payment
	{ path: 'shoppingCart', component: ShoppingCartComponent },
	{ path: 'coupons', component: CouponComponent },

	// ### Notification
	{ path: 'notifications', component: NotificationsComponent }, // ne znam da li je ikada radilo?
	{ path: 'author-notifications', component: PublicPointNotificationsComponent } // ne znam (menjati)
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
