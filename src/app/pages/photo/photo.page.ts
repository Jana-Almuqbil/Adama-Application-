import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { ProgressService } from '../../services/progress.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-photo-page',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
  standalone: false,
})

export class PhotoPage implements OnInit {
    // Stepper labels and current step
  stepLabels = ['Take image', 'Body Affected', 'Symptoms'];
  currentStep = 1;
  
    // Selected image to display/predict
  selectedImage: string | null | undefined = null;

  constructor(private ImageService: ImageService,private route: ActivatedRoute,private navCtrl: NavController, private progressService: ProgressService, private http: HttpClient, private router: Router,) { }

 
  ionViewWillEnter() {
    this.progressService.setStep(1);
    this.currentStep = this.progressService.getStep();
    this.selectedImage = this.ImageService.getImage(); 
    this.progressService.setStep(1);
    this.currentStep = this.progressService.getStep();
  }
  
  goBack() {
    this.navCtrl.navigateBack('/home'); 
  }

  goToNextPage() {
    this.router.navigate(['/questionaire']);
  }

  predictDiagnosis() {
    if (!this.selectedImage) return;
  
    const apiUrl = 'http://localhost:5000/predict';
    console.log('Selected image:', this.selectedImage);

    this.http.post(apiUrl, { image: this.selectedImage }).subscribe({
      next: (response: any) => {
        console.log('Model response:', response);
  
        localStorage.setItem('uploadedImage', this.selectedImage || '');
        localStorage.setItem('predictedClass', response.predicted_class);
        localStorage.setItem('confidence', response.confidence.toString());
  
        // Navigate to result page
        this.goToNextPage();
      },
      error: (error) => {
        console.error('API error:', error);
        alert('Prediction failed. Please try again.');
      }
    });
  }  
  
    // Navigate to notifications page
  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedImage = params['selectedImage'] || this.ImageService.getImage();
    });
  }

}