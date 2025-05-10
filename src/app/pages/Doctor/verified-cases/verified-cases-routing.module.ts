import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifiedCasesPage } from './verified-cases.page';

const routes: Routes = [
  {
    path: '',
    component: VerifiedCasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifiedCasesPageRoutingModule {}
