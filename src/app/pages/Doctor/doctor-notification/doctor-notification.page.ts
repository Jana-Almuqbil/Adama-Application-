import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctor-notification',
  templateUrl: './doctor-notification.page.html',
  styleUrls: ['./doctor-notification.page.scss'],
  standalone: false,
})
export class DoctorNotificationPage {
  // Controls the active tab (all, read, unread)
  selectedTab: string = 'all';

  // Holds all notification entries
  notifications: any[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  // Fetch notifications when page is about to enter
  async ionViewWillEnter() {
    try {
      this.notifications = [];

      // Get all baby documents under New_Case
      const doctorNotifRef = collection(this.firestore, `New_Case`);
      const snapshot = await getDocs(doctorNotifRef);

      if (!snapshot.empty) {
        // Loop through each babyId and get their cases
        await Promise.all(snapshot.docs.map(async (doc) => {
          const babyId = doc.id;
          const verificationRef = collection(this.firestore, `New_Case/${babyId}/cases`);
          const verificationSnapshot = await getDocs(verificationRef);

          verificationSnapshot.forEach((verificationDoc) => {
            const data = verificationDoc.data();
            this.notifications.push({
              icon: 'mail-unread-outline',
              title: `New Case Assigned for ${data['babyId']}`,
              message: `Diagnosis pending for review: ${data['diseaseName']}`,
              date: new Date(data['timestamp'].seconds * 1000).toLocaleString(),
              read: data['read'] || false,
              babyId: data['babyId'],
              caseId: verificationDoc.id,
              uploadedImage: data['uploadedImage'],
              confidence: data['confidence'],
              status: data['status'] || 'Pending Review',
            });
          });
        }));
      } else {
        console.log('No Doctor notifications found!');
      }

      console.log('Notifications fetched:', this.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  // Filter notifications by tab
  get filteredNotifications() {
    if (this.selectedTab === 'read') {
      return this.notifications.filter(item =>
        item.status === 'Opened by Doctor Ahmed, and waiting for verification' ||
        item.status === 'Verified');
    } else if (this.selectedTab === 'unread') {
      return this.notifications.filter(item =>
        item.status === 'Pending Review By Doctor');
    } else {
      return this.notifications.filter(item =>
        item.status === 'Opened by Doctor Ahmed, and waiting for verification' ||
        item.status === 'Verified' ||
        item.status === 'Pending Review By Doctor');
    }
  }

  // Navigate to case details and store selected case
  openCase(item: any) {
    localStorage.setItem('babyCase', JSON.stringify(item));
    this.navCtrl.navigateForward('/case-details');
  }

  // Set active tab
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  // Navigate back
  goBack() {
    this.navCtrl.back();
  }
}
