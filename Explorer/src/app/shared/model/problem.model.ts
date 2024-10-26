export enum Category {
	Accommodation,
	Transportation,
	Guides,
	Organization,
	Safety
}

export enum Priority {
	High,
	Medium,
	Low
}

export const categoryToStringArray = (): string[] => {
	return Object.keys(Category).filter(key => isNaN(Number(key)));
};

export const priorityToStringArray = (): string[] => {
	return Object.keys(Priority).filter(key => isNaN(Number(key)));
};

export interface Problem {
	id?: number;
	userId: number;
	tourId: number;
	category: Category;
	priority: Priority;
	description?: string;
	reportedAt: string;
}
