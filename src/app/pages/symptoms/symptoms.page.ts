import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ProgressService } from '../../services/progress.service';
@Component({
  selector: 'app-symptoms',
  templateUrl: './symptoms.page.html',
  styleUrls: ['./symptoms.page.scss'],
  standalone: false,
  
  
})
export class SymptomsPage implements OnInit {
  currentStep = 3;
  stepLabels = ['Take image', 'Body Affected', 'Symptoms'];
  
  ionViewWillEnter() {
    this.currentStep = 3; 
  }
  
  constructor(
    private progressService: ProgressService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }

  goBack() {
    this.navCtrl.navigateBack('/questionaire'); 
  }
 
  ngOnInit() {
    
  }

  submit() {
    localStorage.setItem('symptomAnswers', JSON.stringify(this.selectedAnswers));
    this.navCtrl.navigateForward('/loading');
  }

  selectedAnswers: { [questionIndex: number]: string } = {};

  selectAnswer(questionIndex: number, answer: string) {
    this.selectedAnswers[questionIndex] = answer;
  }

  async showFeverAlertAndSelect() {
    this.selectedAnswers[0] = 'yes';
  
    const alert = await this.alertController.create({
      cssClass: 'fever-alert-clean',
     // header: 'Fever Detected',
      subHeader: 'Fever Detected 🌡️',
      message: 'Please consult a doctor immediately.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'fever-ok-button',
        },
      ],
    });
    
  
    await alert.present();
  }
  
  
}


