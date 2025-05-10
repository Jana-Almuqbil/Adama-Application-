import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { ProgressService } from '../../services/progress.service';
@Component({
  selector: 'app-questionaire',
  templateUrl: './questionaire.page.html',
  styleUrls: ['./questionaire.page.scss'],
  standalone: false,
})
export class QuestionairePage implements OnInit {
  currentStep = 2;
  stepLabels = ['Take image', 'Body Affected', 'Symptoms'];
  
  selectedCardIndex: number | null = null;

  constructor(private navCtrl: NavController,private progressService: ProgressService) {}  

  ionViewWillEnter() {
    this.progressService.setStep(2);
    this.currentStep = this.progressService.getStep();
  }

  goBack() {
    this.navCtrl.navigateBack('/photo-page'); 
  }

  goToNextPage() {
    this.navCtrl.navigateForward('/symptoms');
  }

  storeAnswers(){
    // Case Symptoms
    const selectedSymptom = this.selectedCardIndex === 0
    ? 'Single Spot – A single growth or spot'
    : this.selectedCardIndex === 1
    ? 'Limited Area – Multiple spots or rash involving 1 or more areas'
    : 'Widespread – Affecting most of the body';

      // Store it in localStorage
    localStorage.setItem('selectedSymptom', selectedSymptom);

    this.goToNextPage();
  }

  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }

  selectCard(index: number) {
    this.selectedCardIndex = index;
  }

  ngOnInit() {
    
  }

}
