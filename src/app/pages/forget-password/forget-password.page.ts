import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
  standalone: false,
})
export class ForgetPasswordPage {
  // Stores the user-entered email address
  email = '';

  constructor(private toastCtrl: ToastController) {}

  // Navigate back to the previous page
  goBack() {
    window.history.back();
  }

  // Trigger password reset email
  async handleAction() {
    if (!this.email) {
      this.showToast('Please enter your email address');
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, this.email);
      this.showToast('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      this.showToast('Error: ' + error.message);
    }
  }

  // Display a toast message
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }
}
