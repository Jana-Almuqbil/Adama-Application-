import { Component } from '@angular/core';
import { doc, updateDoc, Firestore, getDoc } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-diagnosis',
  templateUrl: './edit-diagnosis.page.html',
  styleUrls: ['./edit-diagnosis.page.scss'],
  standalone: false,
})
export class EditDiagnosisPage {
  // Fields to hold updated values
  diagnosis = '';
  treatment = '';
  notes = '';

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  // Navigate back to the previous page
  goBack() {
    this.navCtrl.back();
  }

  // Save changes and update the case in Firestore
  async editAndSaveChanges() {
    try {
      const savedCase = JSON.parse(localStorage.getItem('babyCase') || '{}');
      const babyId = savedCase.babyId;
      const caseId = savedCase.caseId;

      if (!babyId || !caseId) {
        console.error('Missing babyId or caseId');
        return;
      }

      const docRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Case document not found');
        return;
      }

      const existingData = docSnap.data();

      // Build the updated data object
      const updateData: any = {
        status: 'Verified',
        read: true,
        verifiedAt: new Date()
      };

      // Update only if a new value was provided
      if (this.diagnosis && this.diagnosis.trim() !== '') {
        updateData.diseaseName = this.diagnosis;
      } else {
        updateData.diseaseName = existingData['diseaseName'];
      }

      if (this.treatment && this.treatment.trim() !== '') {
        updateData.treatmentName = this.treatment;
      } else {
        updateData.treatmentName = existingData['treatmentName'];
      }

      if (this.notes && this.notes.trim() !== '') {
        updateData.doctorNotes = this.notes;
      } else {
        updateData.doctorNotes = existingData['doctorNotes'];
      }

      // Update document in Firestore
      await updateDoc(docRef, updateData);

      // Store updated case locally
      localStorage.setItem('selectedVerifiedCase', JSON.stringify({
        ...savedCase,
        diseaseName: updateData.diseaseName,
        treatmentName: updateData.treatmentName,
        doctorNotes: updateData.doctorNotes,
        status: updateData.status
      }));

      console.log('Diagnosis updated and verified');
      this.navCtrl.navigateRoot('/doctor-home');

    } catch (error) {
      console.error('Error saving diagnosis:', error);
    }
  }

  // Populate form fields from saved case
  ngOnInit() {
    const selectedCase = JSON.parse(localStorage.getItem('babyCase') || '{}');
    this.diagnosis = selectedCase.diseaseName || '';
    this.treatment = selectedCase.treatmentName || '';
    this.notes = selectedCase.doctorNotes || '';
  }
}
