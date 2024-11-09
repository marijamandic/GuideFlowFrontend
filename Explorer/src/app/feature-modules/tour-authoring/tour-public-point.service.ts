import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicPoint } from './model/publicPoint.model';
import { PublicPointNotification } from './model/publicPointNotification.model';

@Injectable({
  providedIn: 'root'
})
export class PublicPointService {

  private baseUrl = 'https://localhost:44333/api/administration/publicpoint';
  private notificationUrl = 'https://localhost:44333/api/administration/publicpointnotification';

  constructor(private http: HttpClient) { }

  // Public Points
  getPublicPoints(page: number, pageSize: number): Observable<{ results: PublicPoint[], totalCount: number }> {
    return this.http.get<{ results: PublicPoint[], totalCount: number }>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  addPublicPoint(publicPoint: PublicPoint): Observable<PublicPoint> {
    return this.http.post<PublicPoint>(`${this.baseUrl}`, publicPoint);
  }

  updatePublicPoint(publicPoint: PublicPoint): Observable<PublicPoint> {
    return this.http.put<PublicPoint>(`${this.baseUrl}/${publicPoint.id}`, publicPoint);
  }

  deletePublicPoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPublicPointsByTour(tourId: number): Observable<PublicPoint> {
    return this.http.get<PublicPoint>(`${this.baseUrl}/${tourId}`);
  }

  getPendingPublicPoints(): Observable<PublicPoint[]> {
    return this.http.get<PublicPoint[]>(`${this.baseUrl}/pending`);
  }

  // Public Point Notifications
  createNotification(notification: PublicPointNotification): Observable<PublicPointNotification> {
    return this.http.post<PublicPointNotification>(`${this.notificationUrl}`, notification);
  }

  updateNotification(id: number, notification: PublicPointNotification): Observable<PublicPointNotification> {
    return this.http.put<PublicPointNotification>(`${this.notificationUrl}/${id}`, notification);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notificationUrl}/${id}`);
  }

  getAllNotifications(page: number, pageSize: number): Observable<{ results: PublicPointNotification[], totalCount: number }> {
    return this.http.get<{ results: PublicPointNotification[], totalCount: number }>(`${this.notificationUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getUnreadNotificationsByAuthor(authorId: number): Observable<PublicPointNotification[]> {
    return this.http.get<PublicPointNotification[]>(`${this.notificationUrl}/unread/${authorId}`);
  }

  getNotificationsByAuthor(authorId: number): Observable<PublicPointNotification[]> {
    return this.http.get<PublicPointNotification[]>(`${this.notificationUrl}/author/${authorId}`);
  }
}
