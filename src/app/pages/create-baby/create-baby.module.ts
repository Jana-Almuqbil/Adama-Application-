import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateBabyPageRoutingModule } from './create-baby-routing.module';

import { CreateBabyPage } from './create-baby.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateBabyPageRoutingModule
  ],
  declarations: [CreateBabyPage]
})
export class CreateBabyPageModule {}
