import { Component, OnInit } from '@angular/core';
import { TourEquipment } from '../model/tour-equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../../administration/model/equipment.model';
import { AdministrationService } from '../../administration/administration.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit{

constructor (private service : TourAuthoringService,private route: ActivatedRoute, private equipmentService: AdministrationService ){
  
}

tourEquipmentRelations :TourEquipment[] = [];
tourEquipment: Equipment[] = [];
equipment: any[] = []; 
selectedEquipment: TourEquipment[] = [];
tourEq: TourEquipment;
availableTourIds: number[] = [1,2,3,4,5]; // Lista ID-eva dostupnih tura
deleteId! : number;// id for deleting
tourId: number;


  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadEquipment();
    this.loadTourEquipment();
    this.loadRelations();
   
  }

  loadTourEquipment(): void {
    console.log(this.tourId);
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: any[]) => {
        console.log('*********metoda load tourEq:************');
        console.log(result);
        if(!result){
          this.tourEquipment = [];
        }
        //this.loadRelations();
        // Pretvorite dobijeni rezultat u Equipment[] format
        this.tourEquipment = result.map(e => ({
          id: e.id,            // Pretpostavimo da Equipment ima polje id
          name: e.name,        // Pretpostavimo da Equipment ima polje name
          description: e.description // Pretpostavimo da Equipment ima polje description
        }));
  
        console.log('Tour Equipment loaded:', this.tourEquipment);
      },
      error: (err: any) => {
        console.error('Error fetching tour equipment:', err);
      }
    });
  }

  loadRelations():void{
   
    this.service.getAllByTour(this.tourId).subscribe({
      next:(result: any[])=>{
        this.tourEquipmentRelations = result.map(e => ({
          id: e.id,
          equipmentId: e.equipmentId,            // Pretpostavimo da Equipment ima polje id
          tourId: e.tourId,        // Pretpostavimo da Equipment ima polje name
          quantity: e.quantity // Pretpostavimo da Equipment ima polje description
        }));

        console.log(this.tourEquipmentRelations);

        //this.tourEquipmentRelations = this.tourEquipmentRelations.filter(r => r.tourId === this.selectedTourId);
        console.log('loaded relations:');
        console.log(result);
        console.log(this.tourEquipmentRelations);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  loadEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results
        .filter(e => !this.tourEquipment.some(te => te.id === e.id))
        .map(e => ({ ...e, quantity: 1 })); // default 1

        console.log(result);
        
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

 /* onTourSelectionChange(): void {
    console.log(`Tour ID changed to: ${this.selectedTourId}`);
    this.loadTourEquipment(); // Ponovno učitavanje opreme za izabranu turu
    console.log('dobavljene ture -----------:');
    console.log(this.tourEquipment);
    this.loadEquipment();
    this.loadRelations();
  }*/

  // Funkcija koja pronalazi naziv opreme na osnovu equipmentId
  getEquipmentName(equipmentId: number): string {
    const foundEquipment = this.equipment.find(e => e.id === equipmentId);
    return foundEquipment ? foundEquipment.name : 'Unknown'; // Vraća ime opreme ili 'Unknown'
  }

   


  // Funkcija za potvrdu i dodavanje opreme za turu
  addSelectedEquipment(): void {
    if( this.selectedEquipment.length === 0){
      alert('Please select equipment first');
    }
    this.selectedEquipment.forEach((equipment) => {
      this.service.addTourEquipment(equipment.equipmentId, this.tourId, 1).subscribe({
          next: (response) => {
            this.loadTourEquipment();
            this.loadEquipment();
            this.loadRelations();
              console.log(`Oprema dodata za turu: ${equipment.equipmentId}`, response);
          },
          error: (err) => {
              console.error(`Error adding equipment with ID ${equipment.equipmentId}:`, err);
          }
      });
      
    });
   
  }

  deleteTourEquipment(id: number): void {
    console.log(this.tourEquipmentRelations);
   this.tourEquipmentRelations.forEach((relation)=>{
    if(relation.equipmentId === id){
      this.service.deleteTourEquipment(relation.id).subscribe({
        next: (response) => {
            this.loadTourEquipment();
           this.loadEquipment();
            console.log(`Obrisana oprema: ${id}`, response);
        },
        error: (err) => {
            console.error(`Error deleting relation ${id}:`, err);
        }
      })
    }
   }
    
   )

    console.log('ID koji se prosledi za delete:', id);
   

}

  
  
  isEquipmentInTour(equipmentId: number): boolean {
    return this.tourEquipment.some(te => te.id === equipmentId);
  }

  toggleEquipmentSelection(equipmentId: number, tourId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
  
    if (target && target.checked !== undefined) {
      const quantity = this.equipment.find(eq => eq.id === equipmentId)?.quantity || 1; // Dodajemo podrazumevanu količinu
      const id = this.equipment.find(eq => eq.id === equipmentId)?.equipmentId || 1;
      if (target.checked) {
        this.tourEq = {id, equipmentId, tourId, quantity }
        this.selectedEquipment.push(this.tourEq);
      } else {
        this.selectedEquipment = this.selectedEquipment.filter(eq => eq.equipmentId !== equipmentId);
      }
    }
  }
  

}
