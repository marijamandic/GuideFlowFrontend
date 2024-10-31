import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ProfileInfoComponent } from 'src/app/feature-modules/administration/profile-info/profile-info.component';
import { EquipmentManagementComponent } from 'src/app/feature-modules/tour-execution/equipment-management/equipment-management.component';
import { ProblemComponent } from 'src/app/feature-modules/administration/problem/problem.component';
import { ReportProblemComponent } from 'src/app/feature-modules/tour-execution/report-problem/report-problem.component';
import { TourObjectComponent } from 'src/app/feature-modules/tour-authoring/tour-object/tour-object.component';
import { CheckpointListComponent } from 'src/app/feature-modules/tour-authoring/tour-checkpoint/tour-checkpoint.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { ClubComponent } from 'src/app/feature-modules/administration/club/club.component';
import { ClubInvitationComponent } from 'src/app/feature-modules/administration/club-invitation/club-invitation.component';
import { ClubInvitationFormComponent } from 'src/app/feature-modules/administration/club-invitation-form/club-invitation-form.component';
import { ClubRequestComponent } from 'src/app/feature-modules/administration/club-request/club-request.component';
import { ClubRequestFormComponent } from 'src/app/feature-modules/administration/club-request-form/club-request-form.component';
import { ClubMemberListComponent } from 'src/app/feature-modules/administration/club-member-list/club-member-list.component';
import { CommentComponent } from 'src/app/feature-modules/blog/comment/comment.component';
import { PostComponent } from 'src/app/feature-modules/blog/post/post.component';
import { CreateBlogComponent } from 'src/app/feature-modules/blog/create-blog/create-blog.component';
import { PostInfoComponent } from 'src/app/feature-modules/blog/post-info/post-info.component';
import { RatingTheAppComponent } from 'src/app/feature-modules/layout/rating-the-app/rating-the-app.component';
import { AllAppRatingsComponent } from 'src/app/feature-modules/administration/all-app-ratings/all-app-ratings.component';
import { TourSpecificationComponent } from 'src/app/feature-modules/marketplace/tour-specification/tour-specification.component';
import { AccountComponent } from 'src/app/feature-modules/administration/account/account.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'profileInfo', component: ProfileInfoComponent },
  { path: 'equipmentManagement', component: EquipmentManagementComponent },
  { path: 'problem', component: ProblemComponent },
  { path: 'report', component: ReportProblemComponent },
  { path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
  { path: 'club-invitation', component: ClubInvitationComponent, canActivate: [AuthGuard] },
  { path: 'club-invitation/add', component: ClubInvitationFormComponent, canActivate: [AuthGuard] },
  { path: 'club-invitation/edit/:id', component: ClubInvitationFormComponent, canActivate: [AuthGuard] },
  { path: 'club-request', component: ClubRequestComponent, canActivate: [AuthGuard] },
  { path: 'club-request/add', component: ClubRequestFormComponent, canActivate: [AuthGuard] },
  { path: 'club-members/:id', component: ClubMemberListComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: PostComponent },
  { path: 'blog/:id', component: PostInfoComponent },
  { path: 'comment', component: CommentComponent },
  { path: 'createBlog', component: CreateBlogComponent },
  { path: 'tourObjects', component: TourObjectComponent, canActivate: [AuthGuard] },
  { path: 'checkpoints', component: CheckpointListComponent },
  { path: 'tour', component: TourComponent },
  { path: 'tourEquipment', component: TourEquipmentComponent },
  { path: 'ratingTheApp', component: RatingTheAppComponent },
  { path: 'allAppRatings', component: AllAppRatingsComponent },
  { path: 'specification', component: TourSpecificationComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
