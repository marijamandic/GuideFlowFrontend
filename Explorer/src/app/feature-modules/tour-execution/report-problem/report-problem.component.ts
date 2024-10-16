import { Component } from '@angular/core';
import { Problem } from '../model/problem.model';
import {
  CATEGORIES,
  PRIORITIES,
  DEFAULT_PROBLEM,
} from '../constants/report-problem.constants';
import { TourExecutionService } from '../tour-execution.service';

@Component({
  selector: 'xp-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.css'],
})
export class ReportProblemComponent {
  problem: Problem = { ...DEFAULT_PROBLEM };
  categories = [...CATEGORIES];
  priorities = [...PRIORITIES];

  constructor(private service: TourExecutionService) {}

  handleClick() {
    this.problem.id = 0;
    this.problem.reportedAt = new Date();
    this.service.createProblem(this.problem);
  }
}
