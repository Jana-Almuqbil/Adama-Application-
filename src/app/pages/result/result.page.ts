import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { addDoc, doc as firestoreDoc } from '@angular/fire/firestore';
import { collection, getDocs, setDoc, updateDoc } from '@firebase/firestore';


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
    localStorage.setItem('savedCaseId', caseId); // Save for later

    const caseRef = doc(this.firestore, `New_Case/${babyId}/cases/${caseId}`);
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

    
    localStorage.setItem('babyCase', JSON.stringify({
      babyId: babyId,
      caseId: caseId // store
    }));

  } catch (error) {
    console.error('Error saving new case:', error);
  }

  await this.addNewBaby(babyId);

}



  // Save into Doctor Notifications
  async confirmVerification() {
  this.showConfirmAlert = true;


  const babyId = localStorage.getItem('selectedBabyId');
  if (!babyId) {
    console.error('Missing babyId!');
    return;
  }

  // 1. Save the case first
  await this.saveNewCase(babyId);

  // 2. Now read the correct caseId
  const caseId = localStorage.getItem('savedCaseId'); 

  if (!caseId) {
    console.error('Missing caseId!');
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
  console.log('babyId:', babyId);
console.log('caseId:', caseId);


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


async ngOnInit() {
  const selectedCase = JSON.parse(localStorage.getItem('selectedVerifiedCase') || '{}');


  if (selectedCase && selectedCase.name) {
    // Coming from clicked old case
    this.diseaseName = selectedCase.name;
    this.confidence = parseFloat(selectedCase.accuracy) || 0;
    this.caseImage = [selectedCase.image];
    this.symptoms = selectedCase.symptoms || [];


    if (selectedCase.caseId) {
      localStorage.setItem('selectedCaseId', selectedCase.caseId);
    }
    if (selectedCase.babyId) {
      localStorage.setItem('selectedBabyId', selectedCase.babyId);
    } else {
      await this.fetchBabyIdFromFirestore();
    }
  } else {
    // Coming from new scan
    this.diseaseName = localStorage.getItem('predictedClass') || '';
    this.confidence = parseFloat(localStorage.getItem('confidence') || '0');


    const savedImage = localStorage.getItem('uploadedImage');
    this.caseImage = savedImage ? [savedImage] : [];


    const savedSymptom = localStorage.getItem('selectedSymptom');
    if (savedSymptom) {
      this.symptoms.push(savedSymptom);
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


  localStorage.setItem('diseaseName', this.diseaseName);
  localStorage.setItem('confidence', this.confidence.toString());


  this.loadTreatmentInfo(this.diseaseName);
  this.similarImages(this.diseaseName);
}




async fetchBabyIdFromFirestore() {
  try {
    const currentBabyId = localStorage.getItem('currentBabyId');
    if (!currentBabyId) {
      console.warn('No currentBabyId found.');
      return;
    }


    const casesRef = collection(this.firestore, `New_Case/${currentBabyId}/cases`);
    const snapshot = await getDocs(casesRef);


    if (!snapshot.empty) {
      const firstCase = snapshot.docs[0];
      const caseData = firstCase.data();


      const caseId = firstCase.id;
      localStorage.setItem('selectedCaseId', caseId);
      localStorage.setItem('selectedBabyId', currentBabyId);


      console.log('Fetched caseId and babyId from Firestore:', caseId, currentBabyId);
    } else {
      console.warn('No cases found for this baby.');
    }
  } catch (error) {
    console.error('Error fetching babyId and caseId from Firestore:', error);
  }
}




async ionViewWillEnter() {
  console.log('Result Page is reloading data...');
  this.ngOnInit();  
}



async addNewBaby(babyName: string) {
  try {
    const babyRef = doc(this.firestore, 'New_Case', babyName); 
    await setDoc(babyRef, {
      babyId: babyName, 
    });

    console.log(`Baby ${babyName} added successfully with babyId.`);
  } catch (error) {
    console.error('Error adding new baby:', error);
  }
}


  }



