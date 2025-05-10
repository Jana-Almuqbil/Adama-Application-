import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: false,
})
export class LoadingPage implements OnInit {

  constructor(private navCtrl: NavController) { }
  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }
  goBack() {
    this.navCtrl.navigateBack('/symptoms'); 
  }
  ngOnInit() {
      setTimeout(() => {
        this.navCtrl.navigateForward('/result');  
      }, 4000);
  }

}