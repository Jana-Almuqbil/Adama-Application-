import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-update-parent',
  templateUrl: './update-parent.page.html',
  styleUrls: ['./update-parent.page.scss'],
  standalone: false,
})
export class UpdateParentPage {
  parent = {
    name: 'Mom Asma',
    email: 'Asma@gmail.com',
  };

  constructor(private navCtrl: NavController) {}

  saveChanges() {
    console.log('Updated info:', this.parent);
    this.navCtrl.back();
  }

  goBack() {
    this.navCtrl.back();
  }
}