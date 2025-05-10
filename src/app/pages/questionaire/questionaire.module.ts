import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionairePageRoutingModule } from './questionaire-routing.module';

import { QuestionairePage } from './questionaire.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionairePageRoutingModule
  ],
  declarations: [QuestionairePage]
})
export class QuestionairePageModule {}
