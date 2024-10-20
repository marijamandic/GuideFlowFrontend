import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms'
import { AdministrationService } from '../administration.service';
import { ClubRequest } from '../model/club-request.model';




@Component({
  selector: 'xp-club-request-form',
  templateUrl: './club-request-form.component.html',
  styleUrls: ['./club-request-form.component.css']
})
export class ClubRequestFormComponent implements OnChanges {

  @Output() clubRequestUpdated = new EventEmitter<null>();
  @Input() clubRequest: ClubRequest;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.clubRequestForm.reset();
    if(this.shouldEdit){
    //this.clubRequestForm.patchValue(this.clubRequest);
    }
  }

  clubRequestForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
    clubId: new FormControl('', [Validators.required]),
    touristId: new FormControl('', [Validators.required])
  })

  addRequest(): void{
    console.log(this.clubRequestForm.value)

    const clubRequest: ClubRequest = {
      status: this.clubRequestForm.value.status || "",
      clubId: Number(this.clubRequestForm.value.clubId) || 0,
      touristId: Number(this.clubRequestForm.value.touristId) || 0,
    }

    this.service.addRequest(clubRequest).subscribe({
      next:(_) => {
        this.clubRequestUpdated.emit()
      }
    })
  }

  updateRequest(): void {
    const clubRequest: ClubRequest = {
      status: this.clubRequestForm.value.status || "",
      clubId: Number(this.clubRequestForm.value.clubId) || 0,
      touristId: Number(this.clubRequestForm.value.touristId) || 0,
    }
    clubRequest.id = this.clubRequest.id;
    /*this.service.addRequest(clubRequest).subscribe({
      next:(_) => {
        this.clubRequestUpdated.emit()
      }
    })*/
  }
}
