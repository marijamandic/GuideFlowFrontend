import { Details } from './details.model';
import { Resolution } from './resolution.model';
import { Message } from './message.model';

export interface Problem {
	id?: number;
	userId: number;
	tourId: number;
	details: Details;
	resolution: Resolution;
	messages: Message[];
}
