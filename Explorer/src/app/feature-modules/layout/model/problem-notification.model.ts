enum NotificationType {
	ProblemNotification
}

enum ProblemNotificationType {
	NewMessage,
	NewDeadline,
	DeadlinePassed
}

export interface ProblemNotification {
	id: number;
	userId: number;
	sender: string;
	message: string;
	createdAt: Date;
	isOpened: boolean;
	type: NotificationType;
	problemId: number;
	pnt: ProblemNotificationType;
}
