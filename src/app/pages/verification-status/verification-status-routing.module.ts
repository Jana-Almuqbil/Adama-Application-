import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificationStatusPage } from './verification-status.page';

const routes: Routes = [
  {
    path: '',
    component: VerificationStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationStatusPageRoutingModule {}
