import { Routes } from '@angular/router';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGaurdService } from '../services/route-gaurd.service';


export const MaterialRoutes: Routes = [
  {
    path: 'category', component: ManageCategoryComponent,
    canActivate: [RouteGaurdService],
    data: { expectedRole: ['admin'] }
  }
];
