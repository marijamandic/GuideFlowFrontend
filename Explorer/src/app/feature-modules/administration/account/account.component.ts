import { Component, OnInit } from '@angular/core';
import { Account, UserRole } from '../model/account.model'
import { AdministrationService } from '../administration.service';
import { LayoutService } from '../../layout/layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

accounts: Account[] = []
  
public UserRole = UserRole;
  
  constructor(private service: AdministrationService, private notificationService: LayoutService, private authService: AuthService) {}
  
  user: User

  ngOnInit(): void {
    this.getAccounts();
    this.authService.user$.subscribe((user)=>{
      this.user = user;
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

  getAccounts() : void {
     this.service.getAccounts().subscribe({
      next: (result: Array<Account>) => {
      this.accounts = result
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  selectedAccountId: number | null = null; // Praćenje selektovanog naloga
  moneyInput: number = 0; // Unos novca
  clicked: boolean = false;

  toggleMoneyInput(account: Account): void {
    if (this.selectedAccountId === account.userId) {
      this.selectedAccountId = null; // Zatvori input ako je već otvoren
      this.moneyInput = 0;
      this.clicked = false;
    } else {
      this.selectedAccountId = account.userId; // Postavi trenutno selektovanog korisnika
      this.moneyInput = 0; // Resetuj unos
      this.clicked = true;
    }
  }
  
  depositMoney(account: Account): void {
    if (this.moneyInput <= 0 && this.clicked) {
      alert('Please enter a valid amount');
      return;
    }
    
    console.log(`Depositing ${this.moneyInput} for user: ${account.username}`);
    this.service.updateMoney(account.userId, this.moneyInput).subscribe({
      next: () => {
        alert(`Money successfully deposited for ${account.username}`);
        this.selectedAccountId = null; 
        this.moneyInput = 0; 
      },
      error: (err) => {
        console.error('Error depositing money:', err);
      }
    });
    this.notificationService.createNotification({
      id: 0,
      userId: account.userId,
      sender: this.user.username,
      message: `Your account has been credited with ${this.moneyInput} AC`,
      createdAt: new Date(),
      isOpened: false,
      type: 1
    }).subscribe({
      next: () => console.log('Notification created successfully'),
      error: err => console.error('Error creating notification', err)
  });
  
  }
  
}
