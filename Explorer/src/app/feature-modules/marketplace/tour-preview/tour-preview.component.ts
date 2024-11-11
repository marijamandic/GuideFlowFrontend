import { Component, Input, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-tour-preview',
  templateUrl: './tour-preview.component.html',
  styleUrls: ['./tour-preview.component.css']
})
export class TourPreviewComponent implements OnInit {

  tourId: number | undefined

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Tour ID:', this.tourId);
  }
}
