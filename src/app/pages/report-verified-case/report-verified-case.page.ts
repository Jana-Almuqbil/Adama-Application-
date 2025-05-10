import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-report-verified-case',
  templateUrl: './report-verified-case.page.html',
  styleUrls: ['./report-verified-case.page.scss'],
  standalone: false,
})

export class ReportVerifiedCasePage {

  // Variables for storing data from localStorage
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

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    const savedCase = localStorage.getItem('selectedVerifiedCase');
    if (savedCase) {
      const selectedVerifiedCase = JSON.parse(savedCase);
  
      this.diseaseName = selectedVerifiedCase.diseaseName || selectedVerifiedCase.predictedClass || 'Unknown';
      this.confidence = selectedVerifiedCase.confidence;
      this.uploadedImage = selectedVerifiedCase.uploadedImage;
      this.caseImages = selectedVerifiedCase.caseImages || [];
      this.symptoms = selectedVerifiedCase.symptoms || [];
      this.treatmentName = selectedVerifiedCase.treatmentName || selectedVerifiedCase.treatment || 'No treatment found';
      this.instructions = selectedVerifiedCase.instructions || 'No instructions available';
      this.status = selectedVerifiedCase.status;

      this.loadSimilarImages(this.diseaseName);
      console.log('Loaded verified case:', selectedVerifiedCase);
    } else {
      console.error('No case data found in localStorage');
    }
  

    console.log('Predicted class:', this.diseaseName);
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