import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionairePage } from './questionaire.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionairePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionairePageRoutingModule {}
