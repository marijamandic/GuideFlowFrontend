import { Component, OnInit } from '@angular/core';
import { EncounterExecutionService } from '../../encounter-execution/encounter-execution.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-add-encounter',
  templateUrl: './add-encounter.component.html',
  styleUrls: ['./add-encounter.component.css']
})
export class AddEncounterComponent implements OnInit {
  checkpointId : number;

  constructor(private encounterService : EncounterExecutionService,private router : Router , private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.checkpointId = params['id'];
    });
  }
}
