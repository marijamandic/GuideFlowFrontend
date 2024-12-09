import { Component, OnInit } from '@angular/core';
import { Account, UserRole } from '../model/account.model'
import { AdministrationService } from '../administration.service';
import { LayoutService } from '../../layout/layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-account',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponenet implements OnInit {

users: Account[] = []
  public UserRole = UserRole;
  roles = {
    0: 'Admin',
    1: 'Author',
    2: 'Tourist'
  } as const;
  selectedAccountId: number | null = null;
  moneyInput: number = 0;
  user: User;
  clicked: boolean = false;

  constructor(private service: AdministrationService, private notificationService: LayoutService, private authService: AuthService) {}
  
  getRoleLabel(role: number): string {
    return this.roles[role as keyof typeof this.roles] || 'Unknown';
  }
  
  ngOnInit(): void {
    this.getAccounts();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
    })
  }

  getAccounts() : void {
     this.service.getAccounts().subscribe({
      next: (result: Array<Account>) => {
      this.users = result
      // console.log(result);
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  ToggleAcountActivty(account : Account) : void {

    this.service.toggleAcountActivity(account).subscribe({
      error: (err: any) => {
        console.log(err)
      }
    })

    account.isActive = account.isActive ? false : true
  }

  toggleMoneyInput(user: Account): void {
    console.log('Clicked user:', user);
    if (this.selectedAccountId === user.id) { 
      this.selectedAccountId = null;
      this.moneyInput = 0;
    } else {
      this.selectedAccountId = user.id; 
      this.moneyInput = 0;
    }
    console.log('Updated selectedAccountId:', this.selectedAccountId);
  }

  getUsername(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.username : 'Unknown User';
  }
  
  closeModal(): void {
    this.selectedAccountId = null; 
    this.moneyInput = 0; 
  }

  depositMoney(): void {
    if (this.moneyInput <= 0) {
      alert('Please enter a valid amount');
      return;
    }
  
    const account = this.users.find((user) => user.id === this.selectedAccountId); // Use userId if required
    if (!account) {
      alert('Invalid account selected');
      return;
    }
  
    console.log('Sending updateMoney request:', account.id, this.moneyInput);
  
    this.service.updateMoney(account.id, this.moneyInput).subscribe({
      next: () => {
        alert(`Successfully added ${this.moneyInput} AC to ${account.username}`);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error depositing money:', err);
      },
    });
  }  
}
