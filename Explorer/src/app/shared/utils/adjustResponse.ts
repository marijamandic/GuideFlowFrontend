import { Problem } from '../model/problem.model';
import { Message } from '../model/message.model';

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
