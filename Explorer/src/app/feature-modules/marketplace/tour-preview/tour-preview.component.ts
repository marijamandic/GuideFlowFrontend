import { Component, Input } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-tour-preview',
  templateUrl: './tour-preview.component.html',
  styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent {

  @Input() tour: Tour;
}
