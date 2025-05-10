import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage {
  darkMode = false;

  constructor(private navCtrl: NavController, private router: Router) {}
  goBack() {
    this.navCtrl.back();
  }
  
  openNotifications() {
    console.log('Opening notification settings...');
  }
  
  rateApp() {
    console.log('Redirecting to app store...');
  }
  
  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'Adama App',
        text: 'Check out Adama your AI baby rash assistant!',
        url: window.location.href,
      });
    } else {
      alert('Sharing not supported.');
    }
  }
  
  contactSupport() {
    window.location.href = 'mailto:aoj.business3@gmail.com';
  }
  
  openFeedbackForm() {
    console.log('Opening feedback form...');
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }
  
  
  deleteAccount() {
    console.log('Account deletion logic here...');
  }
  
  logout() {
    this.router.navigate(['/login']);
    console.log('User logged out.');
  }

}  
