import { Level } from 'src/app/feature-modules/tour-authoring/model/tour.model';

export interface TourDetails {
	id: number;
	name: string;
	description: string;
	level: Level;
	tags: string[];
}
