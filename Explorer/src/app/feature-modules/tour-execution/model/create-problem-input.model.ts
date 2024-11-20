import { Category, Priority } from 'src/app/shared/model/details.model';

export interface CreateProblemInput {
	userId: number;
	tourId: number;
	category: Category;
	priority: Priority;
	description: string;
}
