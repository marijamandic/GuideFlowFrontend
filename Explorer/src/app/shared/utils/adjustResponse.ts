import { Problem } from '../model/problem.model';
import { Message } from '../model/message.model';
import { ProblemNotification } from 'src/app/feature-modules/layout/model/problem-notification.model';

export const adjustProblemsArrayResponse = (problems: Problem[]): Problem[] => {
	return [
		...problems.map(problem => ({
			...problem,
			resolution: {
				...problem.resolution,
				reportedAt: new Date(problem.resolution.reportedAt),
				deadline: new Date(problem.resolution.deadline)
			}
		}))
	];
};

export const adjustMessageArrayResponse = (messages: Message[]): Message[] => {
	return [
		...messages.map(message => ({
			...message,
			postedAt: new Date(message.postedAt)
		}))
	];
};

export const adjustNotificationArrayResponse = (notifications: ProblemNotification[]): ProblemNotification[] => {
	return [
		...notifications.map(notification => ({
			...notification,
			createdAt: new Date(notification.createdAt)
		}))
	];
};
