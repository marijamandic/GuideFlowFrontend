import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileInfoComponent } from 'src/app/feature-modules/administration/profile-info/profile-info.component';
import { EquipmentManagementComponent } from 'src/app/feature-modules/tour-execution/equipment-management/equipment-management.component';
// import { ProblemComponent } from 'src/app/feature-modules/administration/problem/problem.component';
import { ReportProblemComponent } from 'src/app/feature-modules/tour-execution/report-problem/report-problem.component';
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
import { TourSpecificationComponent } from 'src/app/feature-modules/marketplace/tour-specification/tour-specification.component';
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';
import { ClubFormComponent } from 'src/app/feature-modules/administration/club/club-form/club-form.component';
import { ClubInfoComponent } from 'src/app/feature-modules/administration/club/club-info/club-info.component';
import { TourViewComponent } from 'src/app/feature-modules/tour-execution/tour-view/tour-view.component';
import { ProblemComponent } from 'src/app/feature-modules/tour-authoring/problem/problem.component';
import { NotificationsComponent } from 'src/app/feature-modules/layout/notifications/notifications.component';
import { ProblemStatusComponent } from 'src/app/feature-modules/tour-execution/problem-status/problem-status.component';
import { AdminProblemComponent } from 'src/app/feature-modules/administration/admin-problem/admin-problem.component';
import { PublicPointRequestsComponent } from 'src/app/feature-modules/tour-authoring/public-point-requests/public-point-requests.component';
import { TourReviewFormComponent } from 'src/app/feature-modules/tour-execution/tour-review-form/tour-review-form.component';
import { TourReviewComponent } from 'src/app/feature-modules/tour-execution/tour-review/tour-review.component';
import { TourPreviewComponent } from 'src/app/feature-modules/marketplace/tour-preview/tour-preview.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { PositionsimComponent } from 'src/app/feature-modules/tour-authoring/positionsim/positionsim.component';
import { TourExecutionDetailsComponent } from 'src/app/feature-modules/tour-execution/tour-execution-details/tour-execution-details.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
import { PublicPointNotificationsComponent } from 'src/app/feature-modules/tour-authoring/public-point-notifications/public-point-notifications.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { ClubDashboardComponent } from 'src/app/feature-modules/administration/club/club-dashboard/club-dashboard.component';
import { EncounterComponent } from 'src/app/feature-modules/encounter-execution/encounter/encounter.component';
import { EncounterFormComponent } from 'src/app/feature-modules/encounter-execution/encounter-form/encounter-form.component';
import { AddEncounterComponent } from 'src/app/feature-modules/tour-authoring/add-encounter/add-encounter.component';
import { ExecutionComponent } from 'src/app/feature-modules/encounter-execution/execution/execution.component';
import { ClubDashboardComponent } from 'src/app/feature-modules/administration/club/club-dashboard/club-dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'profileInfo', component: ProfileInfoComponent },
  { path: 'equipmentManagement', component: EquipmentManagementComponent },
  //{ path: 'problem', component: ProblemComponent },
  { path: 'report', component: ReportProblemComponent },
  { path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
  { path: 'club-info/:id', component: ClubInfoComponent, canActivate: [AuthGuard] },
  { path: 'club-dashboard/:id', component: ClubDashboardComponent, canActivate: [AuthGuard] },
  { path: 'new-club', component: ClubFormComponent, canActivate: [AuthGuard]},
  { path: 'blog', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: PostInfoComponent, canActivate: [AuthGuard] },
  { path: 'comment', component: CommentComponent },
  { path: 'edit-post/:id', component: CreateBlogComponent },
  { path: 'create-blog', component: CreateBlogComponent },
  { path: 'tourObjects', component: TourObjectComponent, canActivate: [AuthGuard] },
  { path: 'checkpoints/:tourId', component: CheckpointListComponent },
  { path: 'tour-execution/:id', component: TourExecutionDetailsComponent},
  { path: 'tour', component: TourComponent },
  { path: 'tourEquipment/:id', component: TourEquipmentComponent },
  { path: 'ratingTheApp', component: RatingTheAppComponent },
  { path: 'allAppRatings', component: AllAppRatingsComponent },
  { path: 'specification', component: TourSpecificationComponent },
  { path: 'purchased', component: PurchasedToursComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'tourView', component: TourViewComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'pending', component: PublicPointRequestsComponent },
  { path: 'tourReview/:tourId/:touristId', component: TourReviewComponent },
  { path: 'author/notifications', component: PublicPointNotificationsComponent },
  { path: 'position-sim', component: PositionsimComponent },
	{ path: 'author-problems', component: ProblemComponent },
	{ path: 'notifications', component: NotificationsComponent },
	{ path: 'tourist-problems', component: ProblemStatusComponent },
	{ path: 'admin-problems', component: AdminProblemComponent },
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'tourPreview/:id', component: TourPreviewComponent},
  {path: 'shoppingCart', component: ShoppingCartComponent},
  {path: 'tourDetails/:tourId', component:TourDetailsComponent, children:[{path:'checkpoints/:tourId', component:CheckpointListComponent}]},
  {path: 'encounters', component: EncounterComponent},
  { path: 'encounter-add', component: EncounterFormComponent },
  { path: 'encounter-update/:id', component: EncounterFormComponent },
  { path: 'author-add-encounter/:id/:tourId', component: AddEncounterComponent},
  { path: 'encounter-execution/:id', component: ExecutionComponent}

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
