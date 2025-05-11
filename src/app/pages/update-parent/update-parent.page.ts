import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-update-parent',
  templateUrl: './update-parent.page.html',
  styleUrls: ['./update-parent.page.scss'],
  standalone: false,
})
export class UpdateParentPage implements OnInit {
  parent = {
    name: '',
    email: '', 
  };

  constructor(
    private navCtrl: NavController,
    private firestore: Firestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const parentId = user.email.toLowerCase();
        const parentRef = doc(this.firestore, `Parents/${parentId}`);
        const parentSnapshot = await getDoc(parentRef);

        if (parentSnapshot.exists()) {
          const data = parentSnapshot.data();
          this.parent.name = data['Name'] || '';
          this.parent.email = data['Email'] || '';
        }
      }
    });
  }

  async saveName() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      this.showToast('User not logged in.', 'danger');
      return;
    }

    const parentRef = doc(this.firestore, `Parents/${user.email.toLowerCase()}`);
    try {
      await updateDoc(parentRef, {
        Name: this.parent.name,
      });
      this.showToast('Name updated successfully.', 'success');
      this.navCtrl.navigateRoot('/profile');
    } catch (error) {
      console.error('Error updating name:', error);
      this.showToast('Error updating name.', 'danger');
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
  }

  goBack() {
    this.navCtrl.back();
  }
}
