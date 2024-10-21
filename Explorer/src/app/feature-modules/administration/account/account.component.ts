import { Component, OnInit } from '@angular/core';
import { Account } from '../model/account.model'
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accounts: Account[] = []
  
  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    this.service.getAccounts().subscribe({
      next: (result: Array<Account>) => {
      this.accounts = result
        console.log(result)
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
