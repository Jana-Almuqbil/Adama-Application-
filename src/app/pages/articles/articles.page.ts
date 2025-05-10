import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
  standalone: false,
})
export class ArticlesPage  {

  description: string =
    'Baby skin is delicate and prone to various types of rashes. Understanding the causes can help parents provide better care and know when to seek medical attention.';

  rashes = [
    {
      title: '1. Diaper Rash:',
      details:
        'Caused by prolonged exposure to wet diapers. Symptoms include red, irritated skin.',
      management:
        'Frequent diaper changes, use of barrier creams, and letting the area air out.',
    },
    {
      title: '2. Heat Rash:',
      details:
        'Occurs when sweat ducts get blocked. Common in hot, humid weather.',
      management: 'Keep your baby cool, dress in breathable fabrics.',
    },
    {
      title: '3. Eczema:',
      details:
        'Characterized by dry, itchy, inflamed skin. Can be triggered by allergens or irritants.',
      management:
        'Moisturizing creams, avoiding known irritants, and consulting a doctor.',
    },
    {
      title: '4. Cradle Cap:',
      details:
        'Scaly, yellowish patches on the scalp. Common in newborns.',
      management: 'Gentle washing and brushing, mild baby shampoo.',
    },
    {
      title: '5. Milia:',
      details:
        'Tiny white bumps on the nose and cheeks, caused by blocked skin flakes.',
      management: 'Usually clears on its own.',
    },
  ];


  shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: 'Understanding Common Baby Rashes',
        text: 'Learn about different types of rashes and how to manage them effectively.',
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported in this browser.');
    }
  }


  constructor(private navCtrl: NavController) {}

  // Function to navigate back
  goBack() {
    this.navCtrl.back();
  }
}
