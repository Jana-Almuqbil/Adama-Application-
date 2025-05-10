import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDiagnosisPage } from './edit-diagnosis.page';

const routes: Routes = [
  {
    path: '',
    component: EditDiagnosisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDiagnosisPageRoutingModule {}
