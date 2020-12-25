import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

export const ROUTES: Routes = [
  {
    component: HomeComponent,
    path: ''
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES)]
})
export class HomeModule {}
