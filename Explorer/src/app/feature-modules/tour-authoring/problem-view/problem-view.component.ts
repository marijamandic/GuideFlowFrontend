import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Problem } from 'src/app/shared/model/problem.model';
import { CreateMessageInput } from '../model/create-message-input.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Message } from 'src/app/shared/model/message.model';
import { adjustMessageArrayResponse } from 'src/app/shared/utils/adjustResponse';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
	selector: 'xp-problem-view',
	templateUrl: './problem-view.component.html',
	styleUrls: ['./problem-view.component.css']
})
export class ProblemViewComponent implements OnInit {
	@Input() problem: Problem | undefined;
	@Output() onMessageAdded = new EventEmitter<Problem>();

	newMessage: string = '';
	user: User;

	constructor(private tourAuthoringService: TourAuthoringService, private authService: AuthService) {}

	handleSendMessageClick() {
		if (!this.problem) return;

		let message: CreateMessageInput = {
			problemId: this.problem.id!,
			content: this.newMessage
		};

		this.tourAuthoringService.createMessage(message, this.user.role).subscribe({
			next: (result: PagedResults<Message>) => {
				this.problem!.messages = adjustMessageArrayResponse(result.results);
				this.onMessageAdded.emit(this.problem);

				this.newMessage = '';
			}
		});
	}

	ngOnInit(): void {
		this.authService.user$.subscribe((user: User) => {
			this.user = user;
		});
	}
}
