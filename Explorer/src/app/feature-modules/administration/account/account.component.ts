import { Component, OnInit } from '@angular/core';
import { Account, UserRole } from '../model/account.model'
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

accounts: Account[] = []
  
public UserRole = UserRole;
  
  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    this.getAccounts()
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
}
