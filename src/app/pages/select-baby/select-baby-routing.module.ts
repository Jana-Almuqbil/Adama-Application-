import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectBabyPage } from './select-baby.page';

const routes: Routes = [
  {
    path: '',
    component: SelectBabyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectBabyPageRoutingModule {}
