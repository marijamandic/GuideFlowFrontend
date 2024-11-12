import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecution } from '../model/tour-execution.model';
import { environment } from 'src/env/environment';
import { UpdateTourExecutionDto } from '../model/update-tour-execution.dto';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'xp-tour-execution-details',
  templateUrl: './tour-execution-details.component.html',
  styleUrls: ['./tour-execution-details.component.css']
})
export class TourExecutionDetailsComponent implements OnInit {
  tourExecutionId: string | null = null;
  user: User | undefined;
  tourExecution: TourExecution | null = null;
  dto: UpdateTourExecutionDto = {
    TourExecutionId: 0,
    Longitude: 0,
    Latitude: 0
  };
  private intervalId: any;
  isReviewFormOpen = false;
  isBelowThirtyFivePercent = false;

  constructor(
    private tourExecutionService: TourExecutionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private percentageSubject = new BehaviorSubject<number | null>(null);
  percentageCompleted = 0;

  ngOnInit(): void {
    this.tourExecutionId = this.route.snapshot.paramMap.get('id');
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    if (this.user && this.tourExecutionId) {
      this.fetchTourExecution();

      this.intervalId = setInterval(() => {
        this.updateTourExecution();
      }, 10000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getImagePath(imageUrl: string) {
    return environment.webRootHost + imageUrl;
  }
  
  getExecutionStatusText(): string {
    switch (this.tourExecution?.executionStatus) {
      case 0:
        return 'Active';
      case 1:
        return 'Completed';
      case 2:
        return 'Abandoned';
      default:
        return 'Unknown';
    }
  }

  fetchTourExecution(): void {
    this.tourExecutionService.getTourExecution(this.tourExecutionId!).subscribe({
      next: (result: TourExecution) => {
        this.tourExecution = result;
        console.log(result);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updateTourExecution() {
    this.dto.TourExecutionId = Number(this.tourExecutionId);
    this.dto.Latitude = 46.2075;
    this.dto.Longitude = 6.1502;
    this.tourExecutionService.updateTourExecution(this.dto).subscribe({
      next: (result: TourExecution) => {
        this.tourExecution = result;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  openReviewForm(): void {
    this.isReviewFormOpen = true;
  }

  closeReviewForm(): void {
    this.isReviewFormOpen = false;
  }

isMoreThanSevenDaysAgo(): boolean {
  if (!this.tourExecution?.lastActivity) {
    return true; 
  }
  const lastActivityDate = new Date(this.tourExecution.lastActivity);
  const currentDate = new Date();
  const diffInDays = (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays < 7;
}

isLessThanThirtyFivePercent(): void {
  if (this.percentageSubject.value !== null) {
    this.isBelowThirtyFivePercent = this.percentageSubject.value <= 35;
    this.percentageCompleted = this.percentageSubject.value;
    console.log(`Prethodni procent: ${this.percentageSubject.value}, Disabled: ${this.isBelowThirtyFivePercent}`);
    return; 
  }

  this.tourExecutionService.getPercentage(this.tourExecution?.id || 0).subscribe({
    next: (percent: number) => {
      console.log(`Pređeni procenat: ${percent}`);
      this.percentageSubject.next(percent);
      this.percentageCompleted = percent;

      const isDisabled = percent <= 35;
      console.log(`Disabled dugme? ${isDisabled}`);
    },
    error: (err: any) => {
      console.error('Greška prilikom dobijanja procenta:', err);
      this.percentageSubject.next(0); 
    }
  });
}

isDisabled(): boolean {
  this.isLessThanThirtyFivePercent();
  if(this.isBelowThirtyFivePercent) {
    console.log("IsDisabled1: ", this.isBelowThirtyFivePercent)
    return true;
  } else if(!this.isMoreThanSevenDaysAgo()) {
    console.log("IsDisabled2: ", this.isBelowThirtyFivePercent)
    return true;
  }
  console.log("IsDisabled3: falsee")
  return false;
}

getReviewMessage(): string {
  const isPastSevenDays = !this.isMoreThanSevenDaysAgo();
  console.log("Manje od 7 dana:", isPastSevenDays)
  console.log("Manje od 35:", this.isBelowThirtyFivePercent)
  if (isPastSevenDays && this.isBelowThirtyFivePercent) {
    return "Review cannot be submitted because more than 7 days have passed since the last activity and less than 35% of the tour has been completed.";
  } else if (isPastSevenDays) {
    return "Review cannot be submitted because more than 7 days have passed since the last activity.";
  } else if (this.isBelowThirtyFivePercent) {
    return "Review cannot be submitted because less than 35% of the tour has been completed.";
  } else {
    return ""; 
  }
  }

  completeSession(): void{
    if (this.tourExecutionId && this.user) {
      this.tourExecutionService.completeSession(this.user.id).subscribe({
        next: (result) => {
          console.log('Session completed successfully', result);
          this.tourExecution = result;
          this.router.navigate([`/purchased`]);
          alert('Session completed successfully');
        },
        error: (err) => {
          if (err.status === 500) {
            console.error('Error completing session', err);
            alert('You can not complete this session yet');
          } else {
            console.error('Other error', err);
          }
        }
      });
    }
  }

  abandonSession(): void{
    if (this.tourExecutionId && this.user) {
      this.tourExecutionService.abandonSession(this.user.id).subscribe({
        next: (result) => {
          console.log('Session abandoned successfully', result);
          this.tourExecution = result;
          this.router.navigate([`/purchased`]);
          alert('Session abandoned successfully');
        },
        error: (err) => {
          if (err.status === 500) {
            console.error('Error abandoning session', err);
            alert('You can not abadnon this session yet');
          } else {
            console.error('Other error', err);
          }
        }
      });
    }
  }

}
