import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
  standalone: false,
})
export class SupportPage {
  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }
  faqs = [
    {
      question: 'How do I verify a diagnosis?',
      answer: 'Doctors can verify a diagnosis by reviewing submitted data and tapping "Approve Diagnosis" at the bottom of the case.',
    },
    {
      question: 'How can I view submitted or verified cases?',
      answer: 'Parents can find submitted cases under History. Doctors can find them under Pending or Verified Cases.',
    },
    {
      question: 'Can I edit the case after it’s approved?',
      answer: 'No, approved cases are final. Please contact support if changes are needed.',
    },
    {
      question: 'How can I reset my password?',
      answer: 'Go to Settings > Account > Reset Password and follow the instructions.',
    },
    {
      question: 'How do I communicate with a doctor or support?',
      answer: 'Use the "Support" tab to chat via WhatsApp or send an email to our team.',
    },
    {
      question: 'Can I upload multiple images when submitting a case?',
      answer: 'Yes. Both parents and doctors can view multiple images related to a case.',
    },
    {
      question: 'Is the AI diagnosis enough?',
      answer: 'The AI provides an initial analysis. Only a doctor can confirm the final diagnosis.',
    },
    {
      question: 'Where can I find updates or feature announcements?',
      answer: 'Visit the Notification tab for all announcements and system updates.',
    }
  ];
  
  
  
  sendEmail() {
    window.open('mailto:support@adamaapp.com', '_blank');
  }
  
  openWhatsApp() {
    window.open('https://wa.me/966500000000', '_blank');
  }
  
}
