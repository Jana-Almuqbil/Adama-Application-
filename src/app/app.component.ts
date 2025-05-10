import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageService } from './services/image.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
takePhoto() {
throw new Error('Method not implemented.');
}
  babyId = " ";
  static userRole$ = new BehaviorSubject<'parent' | 'doctor' | null>(null); // static = shared across app
  userRole: 'parent' | 'doctor' | null = null;

  constructor(private imageService: ImageService ,private router: Router) {
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

  ngOnInit() {
    this.babyId = localStorage.getItem('selectedBabyId')|| '{}';
  }
}