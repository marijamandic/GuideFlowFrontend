import { Component, OnInit } from '@angular/core';
import { TourEquipment } from '../model/tour-equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit{

constructor (private service : TourAuthoringService){}

tourEquipment: TourEquipment[] = [];

  ngOnInit(): void {
  this.service.getTourEquipment().subscribe({
    next:(result : PagedResults<TourEquipment>) => {
      console.log(result);
      this.tourEquipment = result.results;
    },
    error:(err : any) =>{
      console.log(err);
    }
  })  
  }
 // tourEquipment: TourEquipment[] = [{id:1,tourId: 1, equipmentId:2, quantity:1}, {id:2,tourId: 1, equipmentId:3, quantity:1}]
}
