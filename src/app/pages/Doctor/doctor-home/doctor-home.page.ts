import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.page.html',
  styleUrls: ['./doctor-home.page.scss'],
  standalone: false,
})
export class DoctorHomePage implements OnInit {
  // Array to hold all pending cases
  pendingCases: any[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  // Navigate back to the previous page
  goBack() {
    this.navCtrl.back();
  }

  // On component initialization
  ngOnInit() {
    this.loadPendingCases();  // Run once when component loads
  }

  // Load all pending cases from Firestore
  async loadPendingCases() {
    this.pendingCases = [];

    const newCaseRef = collection(this.firestore, `New_Case`);
    const snapshot = await getDocs(newCaseRef);

    // Loop through each baby document
    for (const docSnap of snapshot.docs) {
      const babyId = docSnap.id;
      const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
      const caseSnapshot = await getDocs(caseRef);

      // Check each case for status
      caseSnapshot.forEach(caseDoc => {
        const data = caseDoc.data();
        if (
          data['status'] === 'Pending Review By Doctor' ||
          data['status'] === 'Opened by Doctor Ahmed, and waiting for verification'
        ) {
          this.pendingCases.push({
            babyId: data['babyId'],
            caseId: caseDoc.id,
            diseaseName: data['diseaseName'],
            uploadedImage: data['uploadedImage'],
            confidence: Number(data['confidence']).toFixed(0),
            date: new Date(data['timestamp'].seconds * 1000).toLocaleDateString(),
          });
        }
      });
    }

    console.log('Pending cases:', this.pendingCases);
  }

  // Store selected case in localStorage and navigate to details
  openCase(caseItem: any) {
    localStorage.setItem('babyCase', JSON.stringify(caseItem));
    this.navCtrl.navigateForward('/case-details');
  }
}
