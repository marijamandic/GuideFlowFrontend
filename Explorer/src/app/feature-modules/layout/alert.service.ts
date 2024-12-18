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
  }> = [];

  private alertsSubject = new BehaviorSubject(this.alerts);
  alerts$ = this.alertsSubject.asObservable();

  private nextId = 1;
  private readonly DEFAULT_DISMISS_TIME = 10; //10 sekundi

  showAlert(
    message: string,
    alertType: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = this.DEFAULT_DISMISS_TIME
  ): void {

    const validDuration = isNaN(duration) || duration < 0 ? this.DEFAULT_DISMISS_TIME : duration;

    const newAlert = {
      id: this.nextId++,
      message,
      alertType,
    };
    this.alerts.push(newAlert);
    this.alertsSubject.next([...this.alerts]);

    if (validDuration > 0) {
      setTimeout(() => {
        this.closeAlert(newAlert.id);
      }, duration * 1000);
    }
  }

  closeAlert(id: number): void {
    this.alerts = this.alerts.filter((alert) => alert.id !== id);
    this.alertsSubject.next([...this.alerts]);
  }
}
