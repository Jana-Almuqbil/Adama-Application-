import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-verification-status',
  templateUrl: './verification-status.page.html',
  styleUrls: ['./verification-status.page.scss'],
  standalone: false,
})
export class VerificationStatusPage {
  verificationDataList: any[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  async ionViewWillEnter() {
    const babyId = localStorage.getItem('selectedBabyId');
    if (!babyId) {
      console.error('No baby ID found');
      return;
    }
  
    const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
    const snapshot = await getDocs(caseRef);
  
    this.verificationDataList = [];
  
    snapshot.forEach(doc => {
      const data = doc.data();
       if (data['status'] === 'Verified' || data['status'] === 'Opened by Doctor Ahmed, and waiting for verification') {
        const submittedDate = this.formatTimestamp(data['timestamp']?.seconds);
        const verifiedDate = this.formatTimestamp(data['verifiedAt']?.seconds);
  
        this.verificationDataList.push({
          title: `${data['diseaseName']} - Submitted on ${submittedDate}`,
          isExpanded: false,
          ready: true,
          caseId: doc.id,
          data: data,
          timestamp: data['timestamp']?.seconds || 0,  
          steps: [
            { icon: 'checkmark-circle-outline', label: 'AI Diagnosis Submitted', date: submittedDate, color: 'success' },
            { icon: 'shield-checkmark-outline', label: 'Diagnosis Verified', date: verifiedDate || '—', color: 'tertiary' }
          ]
        });
      }
    });
  
    
    this.verificationDataList.sort((a, b) => b.timestamp - a.timestamp);
  
    console.log('Verified cases:', this.verificationDataList);
  }
  

  formatTimestamp(seconds: number): string {
    if (!seconds) return '—';
    const dt = new Date(seconds * 1000);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  toggleDetails(index: number) {
    this.verificationDataList[index].isExpanded = !this.verificationDataList[index].isExpanded;
  }

openReport(item: any) {
  if (item && item.caseId) {
    localStorage.setItem('selectedCaseId', item.caseId);  
    localStorage.setItem('selectedBabyId', localStorage.getItem('selectedBabyId') || 'unknown-baby-id');
    this.navCtrl.navigateForward('/report-verified-case');
  } else {
    console.error('Invalid item structure:', item);
  }
}




  goBack() {
    this.navCtrl.back();
  }
}
