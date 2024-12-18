import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from '../model/problem-notification.model';
import { adjustNotificationArrayResponse } from 'src/app/shared/utils/adjustResponse';
import { Router } from '@angular/router';

@Component({
	selector: 'xp-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
	user: User;
	notifications: ProblemNotification[];

	constructor(private layoutService: LayoutService, private authService: AuthService, private router: Router) {}

	subscribeUser() {
		this.authService.user$.subscribe((user: User) => {
			this.user = { ...user };
		});
	}

	getNotifications() {
		this.layoutService.getProblemNotificationsByUserId(this.user.role).subscribe({
			next: (result: PagedResults<ProblemNotification>) => {
				this.notifications = adjustNotificationArrayResponse(result.results);
			}
		});
	}

	handleNotificationClick(id: number) {
		this.layoutService.patchIsOpened(id).subscribe({
			next: (result: ProblemNotification) => {
				let idx = this.notifications.findIndex(n => n.id === id);
				this.notifications[idx] = result;
			}
		});
	}

	handleOpenProblem(id: number, problemId: number) {
		this.handleNotificationClick(id);
		this.router.navigate(['/author-problems'], { state: { problemId: problemId } });
	}

	ngOnInit(): void {
		this.subscribeUser();
		this.getNotifications();
	}
}
