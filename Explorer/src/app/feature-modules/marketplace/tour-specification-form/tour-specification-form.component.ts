import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourSpecification } from '../model/tour-specification.model';
import { MarketplaceService } from '../marketplace.service';

@Component({
  selector: 'xp-tour-specification-form',
  templateUrl: './tour-specification-form.component.html',
  styleUrls: ['./tour-specification-form.component.css']
})
export class TourSpecificationFormComponent implements OnChanges {
  
   @Output() tourSpecificationUpdated = new EventEmitter<null>();
   @Input() tourSpecification: TourSpecification;
   @Input() shouldEdit: boolean = false;

  private userId: number;

  constructor(private service: MarketplaceService,
              private authService: AuthService
  ){
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id;
    })
  }

  ngOnChanges(changes : SimpleChanges): void {
    this.tourspecifForm.reset();
    if (this.shouldEdit && this.tourSpecification) {
      this.tourspecifForm.patchValue({
        tourDifficulty: String(this.tourSpecification.tourDifficulty),
        walkRating: String(this.tourSpecification.walkRating),
        bikeRating: String(this.tourSpecification.bikeRating),
        carRating: String(this.tourSpecification.carRating),
        boatRating: String(this.tourSpecification.boatRating),
        tags: this.tourSpecification.tags.join(', ')
      });
    }
  }
  
  tourspecifForm = new FormGroup({
    tourDifficulty: new FormControl('', [Validators.required]),
    walkRating: new FormControl('', [Validators.required]),
    bikeRating: new FormControl('', [Validators.required]),
    carRating: new FormControl('', [Validators.required]),
    boatRating: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });

  addSpecification(): void{
    if(this.tourspecifForm.valid){
      const newSpecification : TourSpecification = {
        userId: this.userId || 0,
        tourDifficulty: Number(this.tourspecifForm.value.tourDifficulty) || 0,
        walkRating: Number(this.tourspecifForm.value.walkRating) || 0,
        bikeRating: Number(this.tourspecifForm.value.bikeRating) || 0,
        carRating: Number(this.tourspecifForm.value.carRating) || 0,
        boatRating: Number(this.tourspecifForm.value.boatRating) || 0,
        tags: this.tourspecifForm.value.tags 
        ? this.tourspecifForm.value.tags.split(',').map(tag => tag.trim())
        : [] 
       // tags: this.tourspecifForm.value.tags.split(',').map(tag => tag.trim()) || []
      };

      console.log("specifikacija za kreiranje: ", newSpecification);

      this.service.addTourSpecification(newSpecification).subscribe({
        next: () => { this.tourSpecificationUpdated.emit()
        }
      });
    }
  }

  updateSpecification() : void{
    //console.log("Updating specification with ID:", this.tourSpecification.id);
    const tourSpecification : TourSpecification = {
      userId: this.userId || 0,
      tourDifficulty: Number(this.tourspecifForm.value.tourDifficulty) || 0,
      walkRating: Number(this.tourspecifForm.value.walkRating) || 0,
      bikeRating: Number(this.tourspecifForm.value.bikeRating) || 0,
      carRating: Number(this.tourspecifForm.value.carRating) || 0,
      boatRating: Number(this.tourspecifForm.value.boatRating) || 0,
      tags: this.tourspecifForm.value.tags 
      ? this.tourspecifForm.value.tags.split(',').map(tag => tag.trim())
      : [] 
     // tags: this.tourspecifForm.value.tags.split(',').map(tag => tag.trim()) || []
    };
    tourSpecification.id = this.tourSpecification.id;

    console.log("specifikacija za azuriranje: ", tourSpecification);
    this.service.updateTourSpecification(tourSpecification).subscribe({
      next: () => { this.tourSpecificationUpdated.emit();
      }
    })
  }
}


