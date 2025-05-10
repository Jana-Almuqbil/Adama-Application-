import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: false,
})
export class NotificationPage {
  selectedTab: string = 'all';
  notifications: any[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  async ionViewWillEnter() {
    const babyId = localStorage.getItem('selectedBabyId');
    if (!babyId) {
      console.error('No baby ID found');
      return;
    }
    const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
    const snapshot = await getDocs(caseRef);

    this.notifications = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const status = data['status'];
    
      const commonData = {
        icon: '',
        title: '',
        message: '',
        date: new Date(data['timestamp']?.seconds * 1000).toLocaleString(),
        read: false,
        diseaseName: data['diseaseName'],
        confidence: data['confidence'],
        uploadedImage: data['uploadedImage'],
        treatmentName: data['treatmentName'],
        instructions: data['instructions'],
        symptoms: data['symptoms'],
        status: status,
      };
    
      if (status === 'Pending Review By Doctor') {
        this.notifications.push({
          ...commonData,
          icon: 'hourglass-outline',
          title: 'Pending Doctor Authentication Review',
          message: 'The AI diagnostic results are pending review by a doctor...',
          date: new Date(data['timestamp']?.seconds * 1000).toLocaleString(),
          read: data['read'] || false,
          babyId: babyId,
          caseId: doc.id,
          ...data  
        });
      } else if (status === 'Opened by Doctor Ahmed, and waiting for verification') {
        this.notifications.push({
          ...commonData,
          icon: 'person-outline',
          title: 'Doctor Authentication Assigned',
          message: 'The AI diagnostic results have been assigned to Dr. Ahmed Malik.',
          date: new Date(data['timestamp']?.seconds * 1000).toLocaleString(),
          read: data['read'] || false,
          babyId: babyId,
          caseId: doc.id,
          ...data  
        });
      } else if (status === 'Verified') {
        this.notifications.push({
          ...commonData,
          icon: 'checkmark-circle-outline',
          title: 'Doctor Authentication Completed',
          message: 'Dr. Ahmed Malik has completed the verification...',
          date: new Date(data['timestamp']?.seconds * 1000).toLocaleString(),
          read: data['read'] || false,
          babyId: babyId,
          caseId: doc.id,
          ...data  
        });
      }
    });
    
    console.log('Parent notifications:', this.notifications);
  }

  get filteredNotifications() {
    if (this.selectedTab === 'all') return this.notifications;
    if (this.selectedTab === 'unread') return this.notifications.filter(n => !n.read);
    return this.notifications.filter(n => n.read);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  goBack() {
    this.navCtrl.back();
  }

  async openCaseReport(item: any) {
    try {
      // Update in Firestore
      const docRef = doc(this.firestore, `New_Case/${item.babyId}/cases/${item.caseId}`);
      await updateDoc(docRef, { read: true });
  
      // Update in UI
      item.read = true;
      this.notifications = [...this.notifications]; // triggers Angular to re-render
  
      // Pass to next page
      localStorage.setItem('selectedVerifiedCase', JSON.stringify(item));
      this.navCtrl.navigateForward('/report-verified-case');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

}

