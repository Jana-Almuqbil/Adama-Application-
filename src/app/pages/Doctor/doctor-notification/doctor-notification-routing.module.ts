import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoctorNotificationPage } from './doctor-notification.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorNotificationPageRoutingModule {}
