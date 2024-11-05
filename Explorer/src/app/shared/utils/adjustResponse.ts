import { Problem } from '../model/problem.model';

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
