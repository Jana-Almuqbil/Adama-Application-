import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-report-verified-case',
  templateUrl: './report-verified-case.page.html',
  styleUrls: ['./report-verified-case.page.scss'],
  standalone: false,
})

export class ReportVerifiedCasePage {

  // Variables for storing data
  diseaseName: string = '';
  confidence: number = 0;
  uploadedImage: string = '';
  caseImages: string[] = [];
  description: string = '';
  causes: string[] = [];
  symptoms: string[] = [];
  treatmentName: string = '';
  instructions: string = '';
  status: string = '';

  imageUrl: string = '';
  imageUrl2: string = '';
  imageUrl3: string = '';

  activeTab = 'about';


  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  async ionViewWillEnter() {
    const babyId = localStorage.getItem('selectedBabyId');
    const caseId = localStorage.getItem('selectedCaseId');

    if (!babyId || !caseId) {
      console.error('Baby ID or Case ID missing in localStorage.');
      return;
    }

    try {
      const caseDocRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      const caseSnapshot = await getDoc(caseDocRef);

      if (caseSnapshot.exists()) {
        const data = caseSnapshot.data();
        
        this.diseaseName = data['diseaseName'] || data['predictedClass'] || 'Unknown';
        this.confidence = parseFloat(data['confidence']) || 0;
        this.uploadedImage = data['uploadedImage'] || 'assets/placeholder.jpg';
        this.caseImages = data['caseImages'] || [];
        this.symptoms = data['symptoms'] || [];
        this.treatmentName = data['treatmentName'] || data['treatment'] || 'No treatment found';
        this.instructions = data['instructions'] || 'No instructions available';
        this.status = data['status'] || 'Not specified';

        this.loadSimilarImages(this.diseaseName);

        console.log('Loaded verified case from Firestore:', data);
      } else {
        console.error('No such case document found.');
      }
    } catch (error) {
      console.error('Error fetching case from Firestore:', error);
    }
  }

  loadSimilarImages(disease: string) {
    if (disease === 'Eczema') {
      this.imageUrl = 'assets/Eczema/Eczema-in-cheeks.png';
      this.imageUrl2 = 'assets/Eczema/Eczema-in-hand.jpeg';
      this.imageUrl3 = 'assets/Eczema/Eczema-in-face.jpeg';
    } else if (disease === 'Psoriasis') {
      this.imageUrl = 'assets/Psoriasis/Psoriasis-arm.jpg';
      this.imageUrl2 = 'assets/Psoriasis/Psoriasis-back.webp';
      this.imageUrl3 = 'assets/Psoriasis/Psoriasis-head.png';
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  getParentAnswersKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  
}