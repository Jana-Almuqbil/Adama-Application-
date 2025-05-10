import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private ImageService: ImageService, private navCtrl: NavController, private router: Router, private firestore: Firestore,) {}

  // Get baby ID from local storage
  babyId = localStorage.getItem('selectedBabyId') || 'unknown-baby-id';

  // Articles to display on homepage
  articles = [
    {
      title: 'Understanding Common Baby Rashes',
      description: 'Learn about different types of rashes and how to manage them.',
      image: 'assets/article1.webp',
      link: '/articles/rashes'
    },
    {
      title: 'When Should You Consult a Doctor?',
      description: 'Find out which symptoms require urgent medical attention.',
      image: 'assets/article2.jpg',
      link: '/articles/consult-doctor'
    }
  ];

  previousScans: any[] = [];

  capturedImage: string | null = null; 
  isFabOpen = false;

  // Toggle floating action button (FAB)
  toggleFab() {
    this.isFabOpen = !this.isFabOpen;
  }

  // Close FAB menu
  closeFab() {
    this.isFabOpen = false;
  }

  // Handle image file selection from gallery
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.showAlert('Unsupported File', 'Only image files (jpg, jpeg, png) are allowed.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      this.ImageService.setImage(imageDataUrl);
      this.navCtrl.navigateForward('/photo', {
        queryParams: {
          selectedImage: imageDataUrl
        }
      });
    };
    reader.readAsDataURL(file);
  }

  // Show alert message
  async showAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = [
      {
        text: 'OK',
        role: 'cancel',
        cssClass: 'fever-ok-button',
      }
    ];
    alert.cssClass = 'fever-alert-clean';
    document.body.appendChild(alert);
    await alert.present();
  }
  
  // Take photo using device camera
  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (!image || !image.format || !image.dataUrl) {
        this.showAlert('Invalid file', 'Please select a valid image.');
        return;
      }

      const allowedFormats = ['jpeg', 'jpg', 'png'];
      const selectedFormat = image.format.toLowerCase();
  
      if (!allowedFormats.includes(selectedFormat)) {
        this.showAlert('Unsupported file', 'Only image files (jpg, jpeg, png) are allowed.');
        return;
      }

      this.ImageService.setImage(image.dataUrl!);
      this.navCtrl.navigateForward('/photo', {
        queryParams: {
          selectedImage: image.dataUrl!
        }
      });

    } catch (error) {
      console.error('Photo error:', error);
      this.showAlert('Error', 'An error occurred while selecting the image.');
    }
  }

  // Optional method to handle other camera options
  openCameraOptions() {
    console.log('Camera options opened');
  }

  // Load previous scans when entering the page
  async ionViewWillEnter() {
    const babyId = localStorage.getItem('selectedBabyId');
    if (!babyId) return;
  
    const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
    const snapshot = await getDocs(caseRef);
  
    this.previousScans = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data['diseaseName'] || 'Unknown',
        date: new Date(data['timestamp']?.seconds * 1000).toLocaleDateString(),
        accuracy: parseFloat(data['confidence']).toFixed(0),
        image: data['uploadedImage'] || 'assets/placeholder.jpg'
      };
    });
  }

  openCase(scan: any) {
    localStorage.setItem('selectedVerifiedCase', JSON.stringify(scan));
    this.navCtrl.navigateForward('/result'); 
  }

}
