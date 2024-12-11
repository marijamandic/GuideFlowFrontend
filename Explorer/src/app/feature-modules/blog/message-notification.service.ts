import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageNotification } from './model/message-notification.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageNotificationService {

  constructor(private http: HttpClient) { }

  createMessageNotification(message : MessageNotification): Observable<MessageNotification>{
    return this.http.post<MessageNotification>(`${environment.apiHost}notifications/tourist/problem/message`,message)
  }
}
