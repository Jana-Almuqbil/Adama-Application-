import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifiedCasesPageRoutingModule } from './verified-cases-routing.module';

import { VerifiedCasesPage } from './verified-cases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifiedCasesPageRoutingModule
  ],
  declarations: [VerifiedCasesPage]
})
export class VerifiedCasesPageModule {}
