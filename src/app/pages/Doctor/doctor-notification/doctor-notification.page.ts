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
  babyId: string='';

  // Holds all notification entries
  notifications: any[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  /* Fetch notifications when page is about to enter*/

    async ionViewWillEnter() {
    try {
      // let caseId = localStorage.getItem('savedCaseId');
      // Clear existing notifications to avoid duplicates
      this.notifications = [];
      // Fetch all babyIds from Doctor_Notifications collection
      const doctorNotifRef = collection(this.firestore, `New_Case`);
      const snapshot = await getDocs(doctorNotifRef);
      
      if (!snapshot.empty) {
        // For each babyId, fetch their verifications sub-collection 
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

      
      // Log notifications to debug
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
    this.navCtrl.navigateForward(['/case-details', { babyId: item.babyId, caseId: item.caseId }]);

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
