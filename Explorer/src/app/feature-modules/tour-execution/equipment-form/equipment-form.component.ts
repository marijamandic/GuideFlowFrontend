import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { EquipmentManagement } from '../model/equipment-management.model';


@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnInit {

  @Output() equipmentUpdated = new EventEmitter<null>();

  constructor(private service: TourExecutionService) { }

  equipmentForm = new FormGroup({
    EquipmentId: new FormControl(0, [Validators.required]),
    TouristId: new FormControl(0, [Validators.required]),
    Status: new FormControl(0, [Validators.required]),
  })

  ngOnInit(): void {
    
  }

  addEquipment(): void {
    if (this.equipmentForm.valid) {
      console.log(this.equipmentForm.value);
      const equipment_m: EquipmentManagement = {
        id: 0,
        equipmentId: Number(this.equipmentForm.value.EquipmentId),
        touristId: Number(this.equipmentForm.value.TouristId),
        status: Number(this.equipmentForm.value.Status),
      }

      this.service.addEquipment(equipment_m).subscribe({
        next: (_) => {
          // console.log("uspesan zahtev!");
          this.equipmentUpdated.emit();
          this.showModal('Equipment added successfully!');

          this.equipmentForm.reset();
        },error: (err) => {
        this.showModal('Error adding equipment.');
      }
      });
    }
    
  }
    showModal(message: string) {
    document.getElementById('modalMessage')!.innerText = message;
    document.getElementById('successModal')!.style.display = 'block';
  }

  closeModal() {
    document.getElementById('successModal')!.style.display = 'none';
  }
}
