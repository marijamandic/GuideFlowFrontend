import { Component, OnInit } from '@angular/core';
import { TourEquipment } from '../model/tour-equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../../administration/model/equipment.model';
import { AdministrationService } from '../../administration/administration.service';
@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit{

constructor (private service : TourAuthoringService, private equipmentService: AdministrationService ){
  
}

tourEquipment: TourEquipment[] = [];
equipment: any[] = []; 
selectedEquipment: { equipmentId: number, quantity: number }[] = [];

availableTourIds: number[] = [1,2,3,4,5]; // Lista ID-eva dostupnih tura
selectedTourId!: number;  // ID ture koji je izabran iz dropdown-a

  ngOnInit(): void {
    this.loadEquipment();
    this.loadTourEquipment();
  }

  loadTourEquipment(): void{
        this.service.getTourEquipment().subscribe({
        next:(result : PagedResults<TourEquipment>) => {
          console.log(result);
          this.tourEquipment = result.results;

          // Postavljanje podrazumevanog izbora na prvi ID ture (ili neki drugi način)
          if (this.availableTourIds.length > 0) {
            this.selectedTourId = this.availableTourIds[0];
          }

        },
        error:(err : any) =>{
          console.log(err);
    }
  })  
  }

  loadEquipment(): void {
    this.equipmentService.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        // Dodaj privremeno polje za quantity svakom Equipment
        this.equipment = result.results.map(e => ({ ...e, quantity: 1 })); // default 1
        console.log(result);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Funkcija koja pronalazi naziv opreme na osnovu equipmentId
  getEquipmentName(equipmentId: number): string {
    const foundEquipment = this.equipment.find(e => e.id === equipmentId);
    return foundEquipment ? foundEquipment.name : 'Unknown'; // Vraća ime opreme ili 'Unknown'
  }

   // Funkcija koja dodaje ili uklanja selektovanu opremu
   toggleEquipmentSelection(equipmentId: number, quantity: number, isChecked: boolean): void {
    if (isChecked) {
      this.selectedEquipment.push({ equipmentId, quantity });
    } else {
      this.selectedEquipment = this.selectedEquipment.filter(eq => eq.equipmentId !== equipmentId);
    }
  }


  // Funkcija za potvrdu i dodavanje opreme za turu
  addSelectedEquipment(): void {
    // Ovde možeš implementirati logiku za slanje podataka na server
    console.log('Oprema dodata za turu: ', this.selectedEquipment);
  }

}
