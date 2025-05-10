import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationStatusPageRoutingModule } from './verification-status-routing.module';

import { VerificationStatusPage } from './verification-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificationStatusPageRoutingModule
  ],
  declarations: [VerificationStatusPage]
})
export class VerificationStatusPageModule {}
