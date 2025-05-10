import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDiagnosisPageRoutingModule } from './edit-diagnosis-routing.module';

import { EditDiagnosisPage } from './edit-diagnosis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDiagnosisPageRoutingModule
  ],
  declarations: [EditDiagnosisPage]
})
export class EditDiagnosisPageModule {}
