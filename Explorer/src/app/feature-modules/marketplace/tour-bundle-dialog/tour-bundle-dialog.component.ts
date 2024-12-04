import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TourBundle } from '../model/tour-bundle.model';
@Component({
  selector: 'xp-tour-bundle-dialog',
  templateUrl: './tour-bundle-dialog.component.html',
  styleUrls: ['./tour-bundle-dialog.component.css']
})
export class TourBundleDialogComponent {
  bundleName: string = '';
  bundlePrice: number
  selectedTours: number[] = []

  constructor(public dialogRef: MatDialogRef<TourBundleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TourBundle
  ) {
    if (data) {
      this.bundleName = data.name
      this.bundlePrice = data.price
      this.selectedTours = data.tourIds
    }
  }

  onSubmit(): void {
    this.dialogRef.close({
      name: this.bundleName,
      price: this.bundlePrice,
      tour: this.selectedTours,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
