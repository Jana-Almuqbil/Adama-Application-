import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

// Interface for typing the case data
interface DoctorNotification {
  predictedClass: string;
  confidence: number;
  treatment: string;
  notes: string;
  status: string;
  read: boolean;
  uploadedImage: string;
  symptoms: string[];
}

@Component({
  selector: 'app-verified-cases',
  templateUrl: './verified-cases.page.html',
  styleUrls: ['./verified-cases.page.scss'],
  standalone: false,
})
export class VerifiedCasesPage implements OnInit {

  // Array to hold all verified cases
  verifiedCases: any[] = [];

  // Variables for the selected verified case (used for preview/display)
  diseaseName: string = '';
  confidence: number = 0;
  treatment: string = '';
  notes: string = '';
  uploadedImage: string = '';
  status: string = '';
  read: boolean = false;
  symptoms: string[] = [];

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  // Runs when the page is about to be entered
  async ionViewWillEnter() {
    this.verifiedCases = [];

    const notifRef = collection(this.firestore, 'New_Case');
    const snapshot = await getDocs(notifRef);

    // Loop through each baby and fetch their verified cases
    for (const docSnap of snapshot.docs) {
      const babyId = docSnap.id;
      const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
      const caseSnapshot = await getDocs(caseRef);

      caseSnapshot.forEach(doc => {
        const caseData = doc.data() as DoctorNotification;
        if (caseData.status === 'Verified') {
          this.verifiedCases.push({
            ...caseData,
            caseId: doc.id,
            babyId: babyId
          });
        }
      });
    }

    console.log('Verified cases:', this.verifiedCases);
  }

  // Toggle visibility of expanded details for a specific case
  toggleDetails(index: number) {
    this.verifiedCases[index].isExpanded = !this.verifiedCases[index].isExpanded;
  }

  // Navigate back to previous page
  goBack() {
    this.navCtrl.back();
  }

  // Open detailed report for a selected verified case
  openReport(caseItem: any) {
    localStorage.setItem('selectedVerifiedCase', JSON.stringify(caseItem));
    this.navCtrl.navigateForward('/report-verified-case');
  }

  // On component initialization, load selected verified case from localStorage
  ngOnInit() {
    const savedCase = localStorage.getItem('selectedVerifiedCase');
    if (savedCase) {
      const selectedVerifiedCase = JSON.parse(savedCase);
      this.diseaseName = selectedVerifiedCase.diseaseName;
      this.confidence = selectedVerifiedCase.confidence;
      this.uploadedImage = selectedVerifiedCase.uploadedImage;
      this.symptoms = selectedVerifiedCase.symptoms;
      this.treatment = selectedVerifiedCase.treatmentName;
    } else {
      console.error('No verified case found in localStorage');
    }
  }
}
