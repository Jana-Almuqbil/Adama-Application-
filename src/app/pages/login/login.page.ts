import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
  
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  
  constructor(private firestore: Firestore, private router: Router, private auth: Auth) {}

      // Email/Password Login
  async login() {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;

      const parentRef = doc(this.firestore, 'Parents', user.email!);
      const parentSnap = await getDoc(parentRef);

      if (parentSnap.exists()) {
        localStorage.setItem('userRole', 'parent');
        AppComponent.userRole$.next('parent');
        this.router.navigate(['/select-baby']);
        return;
      }

      const doctorRef = doc(this.firestore, 'Doctors', user.email!);
      const doctorSnap = await getDoc(doctorRef);

      if (doctorSnap.exists()) {
        localStorage.setItem('userRole', 'doctor');
        AppComponent.userRole$.next('doctor');
        this.router.navigate(['/doctor-home']);
        return;
      }

      this.errorMessage = 'User found but not categorized.';
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = 'Invalid email or password.';
    }
  }
  
  // Google Login
  async googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
  
      const email = userCredential.user.email!;
      const parentId = email;
      const parentRef = doc(this.firestore, 'Parents', parentId);
      const parentSnap = await getDoc(parentRef);
  
      if (!parentSnap.exists()) {
        // Create parent doc if it doesn't exist
        await setDoc(parentRef, {
          Name: userCredential.user.displayName || 'Google User',
          Email: email,
        });
      }
  
      localStorage.setItem('parentId', parentId);
      this.router.navigate(['/select-baby']);
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  // Navigate to Signup
  goToSignup() {
    this.router.navigate(['/signup']);
    }

  goToForgetPassword(){
    this.router.navigate(['/forget-password']);
    }
      
}

