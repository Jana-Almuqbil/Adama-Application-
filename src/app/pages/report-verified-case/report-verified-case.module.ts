import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportVerifiedCasePageRoutingModule } from './report-verified-case-routing.module';

import { ReportVerifiedCasePage } from './report-verified-case.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportVerifiedCasePageRoutingModule
  ],
  declarations: [ReportVerifiedCasePage]
})
export class ReportVerifiedCasePageModule {}
