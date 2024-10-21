import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./feature-modules/layout/home/home.component";
import { EquipmentManagementComponent } from "./feature-modules/tour-execution/equipment-management/equipment-management.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'equipment-management', component: EquipmentManagementComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }