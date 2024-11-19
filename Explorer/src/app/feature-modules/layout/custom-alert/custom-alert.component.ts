import { Component } from '@angular/core';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css'],
})
export class CustomAlertComponent {
  alerts: Array<{
    id: number;
    message: string;
    alertType: 'success' | 'error' | 'info' | 'warning';
    dismissable: boolean;
  }> = [];

  constructor(private alertService: AlertService) {
    this.alertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  getAlertLabel(alertType: 'success' | 'error' | 'info' | 'warning'): string {
    const labels = {
      success: 'Success:',
      error: 'Error:',
      info: 'Info:',
      warning: 'Warning:',
    };
    return labels[alertType] || 'Info:';
  }

  closeAlert(id: number): void {
    this.alertService.closeAlert(id);
  }
}
