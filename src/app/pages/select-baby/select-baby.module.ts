import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectBabyPageRoutingModule } from './select-baby-routing.module';

import { SelectBabyPage } from './select-baby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectBabyPageRoutingModule
  ],
  declarations: [SelectBabyPage]
})
export class SelectBabyPageModule {}
