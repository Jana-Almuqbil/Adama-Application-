import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false,
})
export class ChangePasswordPage {
  // Input field variables
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Toggle flags for password visibility
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {}

  // Navigate back to previous page
  goBack() {
    this.navCtrl.back();
  }

  // Handle password update
  async updatePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.showToast('Please fill out all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showToast('New passwords do not match');
      return;
    }

    this.showToast('Password updated successfully!');
    this.navCtrl.back();
  }

  // Show toast message
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }

  // Toggle password visibility for specified field
  toggleShow(field: string) {
    if (field === 'current') this.showCurrent = !this.showCurrent;
    if (field === 'new') this.showNew = !this.showNew;
    if (field === 'confirm') this.showConfirm = !this.showConfirm;
  }
}
