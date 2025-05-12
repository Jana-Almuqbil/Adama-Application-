import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from './services/image.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {


static babyName$ = new BehaviorSubject<string>('');
static babyImage$ = new BehaviorSubject<string>('assets/images/profile-avater.png');
static babyId$ = new BehaviorSubject<string>('');


takePhoto() {
throw new Error('Method not implemented.');
}
  babyId = " ";
  static userRole$ = new BehaviorSubject<'parent' | 'doctor' | null>(null); // static = shared across app
  userRole: 'parent' | 'doctor' | null = null;

  constructor(private imageService: ImageService ,private router: Router,private alertController: AlertController) {
    // Subscribe to role changes
    AppComponent.userRole$.subscribe(role => {
      this.userRole = role;
    });

    // Initial role (from storage)
    const savedRole = localStorage.getItem('userRole') as 'parent' | 'doctor' | null;
    if (savedRole) {
      AppComponent.userRole$.next(savedRole);
    }
  }
  
  goToSelectBaby() {
    this.router.navigate(['/select-baby']);
  }
  takePhotoFromMenu() {
    this.imageService.takePhotoFromMenu();
  }

  getBabyId(): string {
  return localStorage.getItem('selectedBabyId') || 'unknown-baby-id';
}

  ngOnInit() {
    this.babyId = localStorage.getItem('selectedBabyId')|| '{}';
  }
async logout() {
  const alert = await this.alertController.create({
    header: 'Confirm Logout',
    message: 'Are you sure you want to log out?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-cancel-button',
        handler: () => {
          console.log('Logout canceled');
        }
      },
      {
        text: 'Logout',
        role: 'destructive',
        cssClass: 'alert-logout-button',
        handler: async () => {
          const auth = getAuth();
          try {
            await auth.signOut();
            localStorage.removeItem('parentId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('selectedBabyId');
            localStorage.removeItem('selectedBabyName');
            localStorage.removeItem('selectedBabyImage');
            console.log('User signed out and local storage cleared.');
            this.router.navigate(['/login']);
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
      }
    ]
  });

  await alert.present();
}

  
}