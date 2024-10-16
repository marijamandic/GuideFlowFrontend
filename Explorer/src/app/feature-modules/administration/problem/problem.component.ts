import { Component } from '@angular/core';
import { Problem } from '../model/problem.model';

@Component({
  selector: 'xp-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css'],
})
export class ProblemComponent {
  problems: Problem[] = [
    {
      id: 1,
      userId: 100,
      tourId: 23,
      category: 'Accommodation',
      priority: 'High',
      description: 'The room is not clean.',
      reportedAt: new Date('2024-10-15T12:34:56Z'),
    },
    {
      id: 2,
      userId: 101,
      tourId: 24,
      category: 'Transportation',
      priority: 'Medium',
      description: 'The bus is late.',
      reportedAt: new Date('2024-10-16T08:15:27Z'),
    },
    {
      id: 3,
      userId: 102,
      tourId: 25,
      category: 'Food',
      priority: 'Low',
      description: 'The food is cold.',
      reportedAt: new Date('2024-10-17T11:43:18Z'),
    },
  ];
}
