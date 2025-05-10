import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorNotificationPageRoutingModule } from './doctor-notification-routing.module';

import { DoctorNotificationPage } from './doctor-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorNotificationPageRoutingModule
  ],
  declarations: [DoctorNotificationPage]
})
export class DoctorNotificationPageModule {}
