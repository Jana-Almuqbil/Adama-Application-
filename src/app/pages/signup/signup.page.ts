import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { updateProfile, getAuth } from 'firebase/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getStorage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  gender: string = '';
  selectedImage: string | null = null;

  agreeToTerms: boolean = false;
  errorMessage: string = '';
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) {}
  
  async register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword || !this.phoneNumber || !this.gender) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }
    if (!this.agreeToTerms) {
      this.errorMessage = 'You must agree to the terms and conditions';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    try {
      // Step 1: Create account securely
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      // Step 2: Upload profile image to Firebase Storage
      let imageUrl = '';
      if (this.selectedImage) {
        try {
          const storage = getStorage();
          const imageRef = ref(storage, `parentProfiles/${user.uid}`);
          await uploadString(imageRef, this.selectedImage, 'data_url');
          imageUrl = await getDownloadURL(imageRef);
        } catch (uploadError) {
          console.warn('Image upload failed:', uploadError);
        }
      }

      // Step 3: Update Firebase Auth user profile
      await updateProfile(user, {
        displayName: this.name,
        photoURL: imageUrl || ''
      });

      // Step 4: Store extra info in Firestore
      const emailId = this.email.trim().toLowerCase();
     
      const parentRef = doc(this.firestore, 'Parents', emailId);
      await setDoc(parentRef, {
        Email: this.email,
        Name: this.name,
        Gender: this.gender,
        PhoneNumber: this.phoneNumber,
        ProfileImageURL: imageUrl || ''
      });

      // Step 5: Store userId in localStorage
      localStorage.setItem('parentId', user.uid);

      console.log('Signup complete');
      this.router.navigateByUrl('/login', { replaceUrl: true });

    } catch (error: any) {
      console.error('Sign-up error:', error);
      this.errorMessage = error.message || 'Something went wrong. Please try again.';
    }
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPassword() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
