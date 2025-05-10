import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { setDoc, doc as firestoreDoc } from '@angular/fire/firestore';
import { collection, getDocs, updateDoc } from '@firebase/firestore';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
  standalone: false,

})
export class ResultPage implements OnInit {

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  goBack() {
    this.navCtrl.back();
  }

  // Variables
  imageUrl: string = '';
  imageUrl2: string = '';
  imageUrl3: string = '';
  caseImage: string[] = [];

  diseaseName: string = '';
  confidence: number = 0;
  symptoms: string[] = [];
  status: string = 'Not Verified By Doctor'; 
  doctorNotes: String = '';
  diagnosisInfo = {
    description: '',
    causes: [],
    instructions: '',
    treatmentName: '',
  };

  activeTab = 'about';  
  
  homeTips = [
    'Keep Skin Moisturized - Apply fragrance-free moisturizers (such as petroleum jelly or hypoallergenic creams) immediately after bathing.',
    'Lukewarm Baths - Avoid hot water, which can dry out the skin. Use mild, fragrance-free soap.',
    'Wear Soft, Breathable Clothing - Cotton is best; avoid wool or synthetic fabrics that can irritate the skin.',
    'Maintain Humidity - Use a humidifier if the air is dry.',
    'Avoid Scratching - Keep baby\'s nails short or use mittens to prevent skin damage.'
  ];

  showConfirmAlert = false;
  showSuccessAlert = false;
  
  confirmButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Verification cancelled');
      }
    },
    {
      text: 'Confirm',
      handler: () => {
        console.log('Diagnosis sent for verification');
        this.showConfirmAlert = false;
  
        //  Show success alert
        setTimeout(() => {
          this.showSuccessAlert = true;
        }, 300);
      }
    }
  ];

  async loadTreatmentInfo(diseaseName: string) {
    const docRef = doc(this.firestore, 'Treatments', diseaseName);
    const snapshot = await getDoc(docRef);
  
    if (snapshot.exists()) {
      const data = snapshot.data();
      console.log('Fetched Firestore data:', data);
  
      this.diagnosisInfo = {
        description: data['Description'] || 'No description found',
        causes: data['Causes'] || [],
        instructions: data['Instructions'] || 'No instructions found',
        treatmentName: data['Treatment_Name'] || 'No treatment name found'
      };
      console.log('Description value:', data['Description']);
      console.log('Type of description:', typeof data['Description']);

    } else {
      console.warn('No document found for:', diseaseName);
    }
  }
  
  async saveNewCase(babyId: string) {
    try {
      
      // Check how many cases this baby already has
      const casesRef = collection(this.firestore, `New_Case/${babyId}/cases`);
      const snapshot = await getDocs(casesRef);
      const nextCaseNumber = snapshot.size + 1;

      // Generate new case ID 
      const caseId = `C${nextCaseNumber}`;
      localStorage.setItem('savedCaseId', caseId); 
    
      const caseRef = firestoreDoc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      await setDoc(caseRef, {
        caseId,
        babyId: babyId,
        diseaseName: this.diseaseName,
        confidence: this.confidence,
        treatmentName: this.diagnosisInfo.treatmentName,
        instructions: this.diagnosisInfo.instructions,
        symptoms: this.symptoms,
        uploadedImage: this.caseImage[0],
        timestamp: new Date(),
        status: this.status,
        doctorNotes: this.doctorNotes
      });

      // Save the case
      const caseData = {
        caseId: caseId,
        babyId: babyId,
        diseaseName: this.diseaseName,
        confidence: this.confidence,
        treatmentName: this.diagnosisInfo.treatmentName,
        instructions: this.diagnosisInfo.instructions,
        symptoms: this.symptoms,
        uploadedImage: this.caseImage[0],
        timestamp: new Date().toISOString(),
        status: this.status,
        doctorNotes: this.doctorNotes
      };
      
      localStorage.setItem('babyCase', JSON.stringify({
        babyId: babyId,
        caseId: caseId //store 
      }));

      console.log('New case saved successfully');
    } catch (error) {
      console.error('Error saving new case:', error);
    }
  }
  
  // SAve into Doctor Notifications
  async confirmVerification() {  
    this.showConfirmAlert = true;
  
    const babyId = localStorage.getItem('selectedBabyId') || 'unknown-baby-id';
    const caseId = localStorage.getItem('savedCaseId');  

    if (!caseId) {
      console.error('No caseId found in localStorage');
      return;
    }

    try {
      const caseRef = firestoreDoc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
      await updateDoc(caseRef, {
        status: 'Pending Review By Doctor'
      });

      console.log('Case status updated successfully');
    } catch (error) {
      console.error('Error sending notification to doctor:', error);
    }
  }
  
  async similarImages (diseaseName: string) {
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

  ngOnInit() {

    // Diagnosis result
    this.diseaseName = localStorage.getItem('predictedClass') || '';
    this.confidence = parseFloat(localStorage.getItem('confidence') || '0');
  
    const savedImage = localStorage.getItem('uploadedImage');
    this.caseImage = savedImage ? [savedImage] : [];
  
    localStorage.setItem('diseaseName', this.diseaseName);
    localStorage.setItem('confidence', this.confidence.toString());

    this.loadTreatmentInfo(this.diseaseName).then(() => {
      const babyId = localStorage.getItem('selectedBabyId') || 'unknown-baby-id';
      this.saveNewCase(babyId);
    });

    // Similar images
    this.similarImages(this.diseaseName);

    // Body affected answer
    const savedSymptom = localStorage.getItem('selectedSymptom');
    if (savedSymptom) {
      this.symptoms = [savedSymptom]; 
    }

    
    const symptomAnswers = JSON.parse(localStorage.getItem('symptomAnswers') || '{}');

    const yesNoLabels = [
      'Fever',
      'Family history of skin conditions',
      'Recent bacterial infection',
      'Pets in the house'
    ];

  
    for (let i = 0; i < yesNoLabels.length; i++) {
      const answer = symptomAnswers[i];
      if (answer === 'yes') {
        this.symptoms.push(` ${yesNoLabels[i]}`);
      } 
    }

    }
  }
