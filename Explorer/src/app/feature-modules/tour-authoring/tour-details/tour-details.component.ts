import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../tour.service';
import { Level, Tour, TourStatus } from '../model/tour.model';
import { Currency } from '../model/price.model';
import { environment } from 'src/env/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddEncounterComponent } from '../add-encounter/add-encounter.component';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent {
  tourId!:number;
  tour:Tour={
    id: 0,
    authorId:-1,
    name: '',
    description: '',
    price: 0,
    level: Level.Easy,
    status: TourStatus.Draft,
    lengthInKm: 0,
    averageGrade: 0.0,
    taggs: [],
    checkpoints: [],
    transportDurations: [],
    reviews: []
  }
  isForEdit:boolean = false;
  tags:string[] = [''];
 
 


  constructor(
    private route : ActivatedRoute, 
    private router: Router, 
    private tourService:TourService, 
    private dialog: MatDialog,
  ){}

  ngOnInit():void{
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));
   
    this.getTour();
  }

  ngOnChanges(): void {
    //his.initializeTour();
    this.tags = ['']; // Resetuj tagove pri promeni
    if (this.isForEdit) {
      this.tags = this.tour.taggs || ['']; // Učitaj postojeće tagove
    }
  }

  getTour():void{
    this.tourService.getTourById(this.tourId).subscribe({
      next: (data) => {
        this.tour = data;
        this.tags = this.tour.taggs || [];
          
        
      }
  });

  
}

deleteTour(id: number): void {
  this.tourService.deleteTour(id).subscribe({
    next: () => {
      this.router.navigate(['/tour']);
      console.log('obrisana tura ', id);
    },
  })
}
onEditClicked(tour: Tour): void {
  this.isForEdit = true;
}

updateTour(): void {
  //const curr = this.ConvertCurrency();
  const level = this.ConvertLevel();
  const status = this.ConvertStatus();
  console.log('update metoda')
  const tour: Tour = {
    name: this.tour.name || "",
    description: this.tour.description || "",
    id: 0,
    authorId:this.tour.authorId,
    price:this.tour.price || 0,
    level: level || 0,
    status: status || 0,
    lengthInKm : this.tour.lengthInKm || 0,
    averageGrade: this.tour.averageGrade || 0,
    taggs: this.tags.filter(tag => tag.trim() !== ''), // Filtriraj prazne tagove
    checkpoints: this.tour.checkpoints || [],
    transportDurations: this.tour.transportDurations || [],
    reviews: this.tour.reviews || [],
    }

    tour.id = this.tour.id;
    this.tourService.updateTour(tour).subscribe({
      next: () => {
          console.log('update ture',tour)
          this.isForEdit=false;
          this.ngOnInit();
      }
    });
  }

  /*ConvertCurrency(): number {
    console.log('Currency je ',this.tour.price.currency)
     switch (this.tour.price.currency.toString()) {
       case  "RSD" :
         return 0;
       case "EUR":
         return 1;
       case "USD":
         return 2;
       default:
         return 0;
     }
   }*/
 
   
   ConvertLevel(): number {
 
     switch (this.tour.level.toString()) {
       case  "Easy" :
         return 0;
       case "Advanced":
         return 1;
       case "Expert":
         return 2;
       default:
         return 0;
     }
   }
 
   
   ConvertStatus(): number {
 
     switch (this.tour.status.toString()) {
       case  "Draft" :
         return 0;
       case "Published":
         return 1;
       case "Archived":
         return 2;
       default:
         return 0; 
     }
   }

addTag(): void {
  this.tags.push(''); // Dodaj novo prazno polje za tag
}

getImagePath(imageUrl: string | undefined){
  if(imageUrl!==undefined){
    return environment.webRootHost+imageUrl;
  }
  return "";
}

getFormattedLevel(level: Level): string {
  const levelNames: { [key in Level]: string } = {
    [Level.Easy]: 'Easy',
    [Level.Advanced]: 'Advanced',
    [Level.Expert]: 'Expert',
  };
  return levelNames[level];
}

getFormattedCurrency(currency: Currency): string {
  const currencySymbols: { [key in Currency]: string } = {
    [Currency.EUR]: '€',
    [Currency.USD]: '$',
    [Currency.RSD]: 'RSD',
  };
  return currencySymbols[currency];
}
navigateToAddEncounter(id : number){
  console.log('ID prosleđen u modal:', id);
  this.openFormModal(id);
  //this.router.navigate(['/author-add-encounter',id,this.tourId]);
}

 openFormModal(id: number): void {

    const dialogRef = this.dialog.open(AddEncounterComponent, {
      data: { checkpointId: id, tourId: this.tour.id}// prosledi podatke samo ako postoji id
    });

    // dialogRef.componentInstance.closeDialog = () => {
    //   dialogRef.close(); // Close the dialog when called from the modal
    // };
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal zatvoren', result);
      window.location.reload();
    });
  }
}



