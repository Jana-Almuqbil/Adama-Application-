import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportVerifiedCasePage } from './report-verified-case.page';

const routes: Routes = [
  {
    path: '',
    component: ReportVerifiedCasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportVerifiedCasePageRoutingModule {}
