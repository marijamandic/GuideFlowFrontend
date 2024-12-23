import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppRating } from './model/AppRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ProblemNotification } from './model/problem-notification.model';
import { environment } from 'src/env/environment';
import { Notification } from './model/Notification.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { Club } from '../administration/model/club.model';
import { TourPreview } from './model/TourPreview';
import { MessageNotification } from './model/MessageNotification.model';
import { ChatLog, ChatMessage } from './model/chatlog.model';

@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	private apiUrl = 'https://localhost:44333/api/tourist/AppRating/rating';

	constructor(private http: HttpClient) {}

	postNewAppRating(rating: AppRating): Observable<AppRating> {
		return this.http.post<AppRating>(this.apiUrl, rating);
	}

	getAppRatings(page: number, pageSize: number): Observable<PagedResults<AppRating>> {
		return this.http.get<PagedResults<AppRating>>(`https://localhost:44333/api/tourist/AppRating/all?page=${page}&pageSize=${pageSize}`);
	}

	getProblemNotificationsByUserId(role: string): Observable<PagedResults<ProblemNotification>> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application-json'
		});
		return this.http.get<PagedResults<ProblemNotification>>(`${environment.apiHost}notifications/${role}/problem`, { headers });
	}

	getNotificationsByUserId(userId: number): Observable<Notification[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.get<Notification[]>(`${environment.apiHost}notifications/tourist/problem/by-user/${userId}`, { headers });
	}

	getNotificationsByAuthorId(userId: number): Observable<Notification[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.get<Notification[]>(`${environment.apiHost}notifications/author/problem/by-user/${userId}`, { headers });
	}
	
	createAuthorMessageNotification(messageNotification: MessageNotification): Observable<MessageNotification> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<MessageNotification>(
			`${environment.apiHost}notifications/author/problem/message`,
			messageNotification,
			{ headers }
		);
	}
		
	getAuthorNotificationMessagesByUserId(userId: number): Observable<MessageNotification[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.get<MessageNotification[]>(
			`${environment.apiHost}notifications/author/problem/message/${userId}`,
			{ headers }
		);
	}

	updateAuthorMessageNotification(id: number, isOpened: boolean): Observable<void> {
		const headers = new HttpHeaders({
		  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
		  'Content-Type': 'application/json'
		});
		return this.http.put<void>(
		  `${environment.apiHost}notifications/author/problem/message/${id}`,
		  isOpened,
		  { headers }
		);
	}

	deleteAuthorNotification(id: number): Observable<void> {
		const headers = new HttpHeaders({
		  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
		  'Content-Type': 'application/json'
		});
		return this.http.delete<void>(
		  `${environment.apiHost}notifications/author/problem/${id}`,
		  { headers }
		);
	}

	deleteAuthorMessageNotification(id: number): Observable<void> {
		const headers = new HttpHeaders({
		  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
		  'Content-Type': 'application/json'
		});
		return this.http.delete<void>(
		  `${environment.apiHost}notifications/author/problem/message/${id}`,
		  { headers }
		);
	}

	updateAuthorNotification(id: number, updatedNotification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.patch<void>(`${environment.apiHost}notifications/author/problem/${id}`, updatedNotification, { headers });
	}
	  	  
	updateNotification(id: number, updatedNotification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.patch<void>(`${environment.apiHost}notifications/tourist/problem/${id}`, updatedNotification, { headers });
	}

	getNotificationMessagesByUserId(userId: number): Observable<MessageNotification[]> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json',
		});
		return this.http.get<MessageNotification[]>(`${environment.apiHost}notifications/tourist/problem/message/${userId}`, { headers });
	}

	updateMessageNotification(id: number, isOpened: boolean): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json',
		});
		return this.http.put<void>(`${environment.apiHost}notifications/tourist/problem/message/${id}`, isOpened, { headers });
	}

	createMessageNotification(messageNotification: MessageNotification): Observable<MessageNotification> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json',
		});
		return this.http.post<MessageNotification>(`${environment.apiHost}message`, messageNotification, { headers });
	}		
	
	createNotification(notification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<void>(
			`${environment.apiHost}notifications/administrator/problem/money-exchange`,
			notification,
			{ headers }
		);
	}	

	createTouristNotifaction(notification: Notification): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json'
		});
		return this.http.post<void>(
			`${environment.apiHost}notifications/tourist/problem/notification`,
			notification,
			{ headers }
		);
	}	
	
	patchIsOpened(id: number) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application-json'
		});

		return this.http.patch<ProblemNotification>(`${environment.apiHost}notifications/author/problem?id=${id}&isOpened=${true}`, { headers });
	}

	deleteNotification(id: number): Observable<void> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${localStorage.getItem('access-token')}`,
			'Content-Type': 'application/json',
		});
		return this.http.delete<void>(`${environment.apiHost}notifications/tourist/problem/${id}`, { headers });
	}
	
	deleteMessageNotification(id: number): Observable<void> {
		const headers = new HttpHeaders({
		  Authorization: `Bearer ${localStorage.getItem('access-token')}`,
		  'Content-Type': 'application/json',
		});
	
		return this.http.delete<void>(
		  `${environment.apiHost}notifications/tourist/problem/message/${id}`,
		  { headers }
		);
	  }


	getAllTours(): Observable<{ results: Tour[], totalCount: number }> {
		return this.http.get<{ results: Tour[], totalCount: number }>(`${environment.apiHost}authoring/tour`);
	}
	

	getAllClubs(): Observable<Club[]> {
		return this.http.get<{ results: Club[]; totalCount: number }>(`${environment.apiHost}manageclub/club`).pipe(
		  map((response) => response.results || []), 
		  tap((clubs) => console.log('Mapped Clubs:', clubs))
		);
	}
	  
	getImagePath(imageUrl: string): string {
		return imageUrl.startsWith('http')
		  ? imageUrl 
		  : `${environment.webRootHost}${imageUrl}`; 
	}
	
	getTopClubs(): Observable<Club[]> {
		return this.http.get<Club[]>(`${environment.apiHost}manageclub/club/top-by-members`);
	}
	
	getAllTourPreviews(): Observable<TourPreview[]> {
		return this.http.get<Tour[]>(`${environment.apiHost}authoring/tour`).pipe(
			map((tours: Tour[]) => 
				tours.map((tour) => {
					try {
						return {
							id: tour.id || 0,
							name: tour.name || 'Unnamed Tour',
							description: tour.description || 'No description available.',
							imageUrl: tour.checkpoints?.[0]?.imageUrl || 'assets/images/default-tour.jpg',
						};
					} catch (error) {
						console.error('Error mapping tour:', tour, error);
						return null; // Return null if mapping fails
					}
				}).filter((tour): tour is TourPreview => tour !== null) // Remove null values
			)
		);
	}	

	GetUserChatLog(userId: number): Observable<ChatLog> {
		return this.http.get<ChatLog>(environment.apiHost + `chatbot/chatLog/${userId}`);
	}

	CreateChatLog(userId: number): Observable<ChatLog> {
		return this.http.post<ChatLog>(environment.apiHost + "chatbot/chatLog/create?userId=" + userId, null);
	}

	UpdateChatLog(chatlog: ChatLog): Observable<ChatLog> {
		return this.http.patch<ChatLog>(environment.apiHost + "chatbot/chatLog/update", chatlog);
	}

	GenerateChatBotResponse(chatMessage: ChatMessage): Observable<ChatMessage> {
		return this.http.post<ChatMessage>(environment.apiHost + "chatbot/prompt", chatMessage);
	}
}
