import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alerts: Array<{
    id: number;
    message: string;
    alertType: 'success' | 'error' | 'info' | 'warning';
    dismissable: boolean;
  }> = [];

  private alertsSubject = new BehaviorSubject(this.alerts);
  alerts$ = this.alertsSubject.asObservable();

  private nextId = 1; // To assign unique IDs to alerts

  showAlert(
    message: string,
    alertType: 'success' | 'error' | 'info' | 'warning' = 'info',
    dismissable: boolean = true
  ): void {
    const newAlert = {
      id: this.nextId++,
      message,
      alertType,
      dismissable,
    };
    this.alerts.push(newAlert);
    this.alertsSubject.next([...this.alerts]); // Emit the updated list of alerts
  }

  closeAlert(id: number): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id); // Remove alert by ID
    this.alertsSubject.next([...this.alerts]); // Emit the updated list of alerts
  }
}
