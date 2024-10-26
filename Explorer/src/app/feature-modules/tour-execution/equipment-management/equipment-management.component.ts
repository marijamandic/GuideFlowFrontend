import { Component, OnInit } from '@angular/core';
import { EquipmentManagement } from '../model/equipment-management.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';


@Component({
  selector: 'xp-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.css']
})
export class EquipmentManagementComponent implements OnInit {
  

  equipment_management: EquipmentManagement[] = [];
  public userId: number;

  constructor(private service: TourExecutionService, private authService: AuthService)
  {
    this.authService.user$.subscribe((user: User) => {
      this.userId = user.id;
    })
  }


  ngOnInit(): void {
    this.getEquipmentManagement(/*this.userId*/);
  }

  getEquipmentManagement(/*userId: number*/): void {
    // if (userId) {
      this.service.getEquipmentManagement(/*userId*/).subscribe({
        next: (result: PagedResults<EquipmentManagement>) => {
          this.equipment_management = result.results;
          console.log("response ", result.results)
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    // }
  }

  deleteEquipment(equipment: EquipmentManagement): void{
    this.service.deleteEquipment(equipment).subscribe({
      next: (_) => {
        this.ngOnInit();
        this.showDeleteModal('Equipment deleted successfully!');
      },
      error: (err) => {
        this.showDeleteModal('Error deleting equipment.');
      }
    });
  }

    showDeleteModal(message: string) {
    document.getElementById('deleteMessage')!.innerText = message;
    document.getElementById('deleteModal')!.style.display = 'block';
  }

  closeDeleteModal() {
    document.getElementById('deleteModal')!.style.display = 'none';
  }
  
}
