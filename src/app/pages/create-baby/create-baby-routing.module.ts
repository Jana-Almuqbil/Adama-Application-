import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBabyPage } from './create-baby.page';

const routes: Routes = [
  {
    path: '',
    component: CreateBabyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBabyPageRoutingModule {}
