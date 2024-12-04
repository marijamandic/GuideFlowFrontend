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
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';
import { ClubFormComponent } from 'src/app/feature-modules/administration/club/club-form/club-form.component';
import { ClubInfoComponent } from 'src/app/feature-modules/administration/club/club-info/club-info.component';
import { ProblemComponent } from 'src/app/feature-modules/tour-authoring/problem/problem.component';
import { NotificationsComponent } from 'src/app/feature-modules/layout/notifications/notifications.component';
import { ProblemStatusComponent } from 'src/app/feature-modules/tour-execution/problem-status/problem-status.component';
import { AdminProblemComponent } from 'src/app/feature-modules/administration/admin-problem/admin-problem.component';
import { PublicPointRequestsComponent } from 'src/app/feature-modules/tour-authoring/public-point-requests/public-point-requests.component';
import { TourReviewComponent } from 'src/app/feature-modules/tour-execution/tour-review/tour-review.component';
import { TourPreviewComponent } from 'src/app/feature-modules/marketplace/tour-preview/tour-preview.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { PositionsimComponent } from 'src/app/feature-modules/tour-authoring/positionsim/positionsim.component';
import { TourExecutionDetailsComponent } from 'src/app/feature-modules/tour-execution/tour-execution-details/tour-execution-details.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/tour-execution/purchased-tours/purchased-tours.component';
import { PublicPointNotificationsComponent } from 'src/app/feature-modules/tour-authoring/public-point-notifications/public-point-notifications.component';
import { ClubDashboardComponent } from 'src/app/feature-modules/administration/club/club-dashboard/club-dashboard.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { TourViewComponent } from 'src/app/feature-modules/tour-execution/tour-view/tour-view.component';

const routes: Routes = [
  // ### HOME
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // ### ACCOUNT SHIT
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: ProfileInfoComponent }, // svaka čast onome ko je ovo radio je nije nigde bilo bindovano
  { path: 'admin-dashboard', component: AccountComponent, canActivate: [AuthGuard] }, // Ovo je buduci admin dashboard
  { path: 'pending', component: PublicPointRequestsComponent }, // ovo treba spojiti sa admin-dashboard, za prihvatane tour objecta
  
  // ### TOURS 
  // --- /tours pregled svih tura (za s ve role), dodavanje tura, search tura
  { path: 'tours', component: TourViewComponent },  
  { path: 'toursForAuthor', component: TourComponent }, // ovo treba spojiti u ovo iznad
  { path: 'purchased', component: PurchasedToursComponent }, // ovo treba napraviti da izgleda kao tours samo sto se druge ucitavaju

  // --- tours/:id pregled pojedinacne ture, dodavanje checkpointa, reviews, equpimentm, redirect na edit ture?
  { path: 'tours/:id', component:TourDetailsComponent, children:[{path:'checkpoints/:tourId', component:CheckpointListComponent}]},
  { path: 'checkpoints/:tourId', component: CheckpointListComponent },  // ovo spajamo u tours/:id
  { path: 'tour-review/:tourId/:touristId', component: TourReviewComponent }, // ovo isto spajamo u tours/:id

  // --- /tour-execution/:id 
  { path: 'tour-execution/:id', component: TourExecutionDetailsComponent}, // blizanac, blizanac 

  // -- ne gde ovo uvezati u frontu
  { path: 'tour-preview/:id', component: TourPreviewComponent},
  { path: 'tour-objects', component: TourObjectComponent, canActivate: [AuthGuard] },
  
  // --- ne znam šta spada u šta, treba mi pomoc 
  { path: 'tour-equipment/:id', component: TourEquipmentComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'equipment-management', component: EquipmentManagementComponent },

  // ### CLUB (nema club posts @nikola.s)
  { path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
  { path: 'club/:id', component: ClubInfoComponent, canActivate: [AuthGuard] },
  { path: 'club-dashboard/:id', component: ClubDashboardComponent, canActivate: [AuthGuard] },
  { path: 'new-club', component: ClubFormComponent, canActivate: [AuthGuard]},

  // ### BLOG (gotovo, ali bih promenio dodavanje/edit)
  { path: 'blog', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: PostInfoComponent, canActivate: [AuthGuard] },
  { path: 'create-blog', component: CreateBlogComponent },
  { path: 'edit-blog/:id', component: CreateBlogComponent },
  
  // ### SHOPPING CART  (biće još kada se sve spoji)
  {path: 'shoppingCart', component: ShoppingCartComponent},

  // ### REPORT
  { path: 'report', component: ReportProblemComponent },  // ako je ovo problem vezano za sve onda ide na dno u footer, ako je vazno samo za ture onda ide negde sa turama
  { path: 'tourist-problems', component: ProblemStatusComponent },  
  { path: 'author-problems', component: ProblemComponent },
  { path: 'admin-problems', component: AdminProblemComponent }, 

  // ### MISC
  { path: 'position-sim', component: PositionsimComponent },  // ovo sam prilično sig da nije potrebno kao posebna komponenta?
  { path: 'rate', component: RatingTheAppComponent }, // ovo negde ubaciti kao pop-up na home page?
  { path: 'all-ratings', component: AllAppRatingsComponent }, // ovo na nekom admin dashboard?
  //{ path: 'problem', component: ProblemComponent }, // ovo je bilo zakomentarisano i ne znam cemu sluzi

  // ### NOTIFICATION
  { path: 'notifications', component: NotificationsComponent }, // ne znam da li je ikada radilo?
  { path: 'author-notifications', component: PublicPointNotificationsComponent }, // ne znam (menjati)
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
