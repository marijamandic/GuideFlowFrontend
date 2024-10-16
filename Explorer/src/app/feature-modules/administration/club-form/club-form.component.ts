import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output,Input } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from '../model/club.model';
import { FormControl, FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {
  
  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService) { }
  
  clubForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    imageUrl: new FormControl('',[Validators.required]),

  });
  ngOnChanges(): void {
    this.clubForm.reset();
    if(this.shouldEdit){
      this.clubForm.patchValue(this.club);
    }
  }
  addClub(): void{
    const club: Club = {
      ownerId: 1,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.imageUrl || "",
    };
    this.service.addClub(club).subscribe({
      next: () => {this.clubUpdated.emit() }
    });
  }
  updateClub() : void {
    const club : Club = {
      ownerId: 1,
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.imageUrl || "",
    };
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: () => {this.clubUpdated.emit();}
    });
  }
}

