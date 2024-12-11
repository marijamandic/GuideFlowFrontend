import { Category, Priority } from '../model/details.model';
import { Level } from 'src/app/feature-modules/tour-authoring/model/tour.model';

export const convertEnumToString = (value: number, type: string): string => {
	let stringValue: string;

	switch (type) {
		case 'category':
			stringValue = Category[value];
			break;
		case 'priority':
			stringValue = Priority[value];
			break;
		case 'level':
			stringValue = Level[value];
			break;
		default:
			stringValue = 'unknown';
			break;
	}

	return stringValue;
};
