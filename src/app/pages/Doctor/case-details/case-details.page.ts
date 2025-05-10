import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.page.html',
  styleUrls: ['./case-details.page.scss'],
  standalone: false,
})
export class CaseDetailsPage {

  // Image URLs for similar conditions
  imageUrl: string = '';
  imageUrl2: string = '';
  imageUrl3: string = '';

  // Case details
  diseaseName: string = '';
  confidence: number = 0;
  treatmentName: string = '';
  instructions: string = '';
  notes: string = '';
  uploadedImage: string = '';
  status: string = 'Verified';
  openedByDoctor: boolean = false;
  symptoms: string[] = [];

  // Case references
  babyCase: any;
  savedCase: any;

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  // Flags for displaying alerts
  showConfirmAlert = false;
  showSuccessAlert = false;

  // Buttons used in confirmation alert
  confirmButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Approval cancelled');
        this.showConfirmAlert = false;
      }
    },
    {
      text: 'Approve',
      role: 'confirm',
      handler: () => {
        this.approveDiagnosis();
      }
    }
  ];

  // Trigger the approval confirmation alert and update status
  confirmApproval() {
    this.showConfirmAlert = true;

    const savedCase = JSON.parse(localStorage.getItem('babyCase') || '{}');
    const babyId = savedCase.babyId;
    const caseId = savedCase.caseId;

    if (!babyId || !caseId) {
      console.error('Missing babyId or caseId');
      return;
    }

    const docRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);

    updateDoc(docRef, {
      status: 'Verified',
      read: true,
      verifiedAt: new Date()
    })
    .then(() => {
      console.log('Case verified successfully');
      this.showConfirmAlert = false;
      this.navCtrl.navigateRoot('/doctor-home');
    })
    .catch(error => {
      console.error('Error verifying case:', error);
    });
  }

  // Navigate back
  goBack() {
    this.navCtrl.back();
  }

  // Approve the diagnosis and update Firestore
  async approveDiagnosis() {
    try {
      console.log('Diagnosis approved');
      this.showConfirmAlert = false;
      this.showSuccessAlert = true;

      const babyId = this.babyCase.babyId;
      const caseId = this.babyCase.caseId;

      const docRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      await updateDoc(docRef, {
        status: 'Verified'
      });

      console.log('Status updated to Verified');
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  }

  // On page enter, fetch saved case from localStorage
  ionViewWillEnter() {
    const saved = localStorage.getItem('babyCase');
    if (saved) {
      this.babyCase = JSON.parse(saved);
      const babyId = this.babyCase.babyId;
      const caseId = this.babyCase.caseId;

      if (babyId && caseId) {
        this.fetchCaseFromFirebase(babyId, caseId);
      } else {
        console.error('Missing babyId or caseId in localStorage');
      }
    }
  }

  // Fetch case data from Firestore
  async fetchCaseFromFirebase(babyId: string, caseId: string) {
    try {
      const docRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.diseaseName = data['diseaseName'];
        this.confidence = data['confidence'];
        this.treatmentName = data['treatmentName'];
        this.instructions = data['instructions'];
        this.notes = data['doctorNotes'];
        this.status = data['status'];
        this.openedByDoctor = true;
        this.uploadedImage = data['uploadedImage'];
        this.symptoms = data['symptoms'];

        console.log('Predicted class (fetched):', this.diseaseName);

        this.similarImages(this.diseaseName);

        await updateDoc(docRef, {
          status: 'Opened by Doctor Ahmed, and waiting for verification'
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching case data: ", error);
    }
  }

  // Set similar images based on predicted disease
  async similarImages(diseaseName: string) {
    if (diseaseName === 'Eczema') {
      this.imageUrl = 'assets/Eczema/Eczema-in-cheeks.png';
      this.imageUrl2 = 'assets/Eczema/Eczema-in-hand.jpeg';
      this.imageUrl3 = 'assets/Eczema/Eczema-in-face.jpeg';
    } else if (diseaseName === 'Psoriasis') {
      this.imageUrl = 'assets/Psoriasis/Psoriasis-arm.jpg';
      this.imageUrl2 = 'assets/Psoriasis/Psoriasis-back.webp';
      this.imageUrl3 = 'assets/Psoriasis/Psoriasis-head.png';
    }
  }

  ngOnInit() {}
}
