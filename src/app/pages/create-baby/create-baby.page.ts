import { Component } from '@angular/core';
import { Firestore, collection, addDoc, setDoc, doc, updateDoc } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-create-baby',
  templateUrl: './create-baby.page.html',
  styleUrls: ['./create-baby.page.scss'],
  standalone: false,
})
export class CreateBabyPage {
  // Baby profile fields
  babyName = '';
  birthDate: any;
  gender = '';
  isDefault = false;
  customAllergy = '';
  babyImage: string | null = null;
  

  // Predefined allergies list
  allergies = [
    { name: 'Antibiotics (Neomycin, Bacitracin, Penicillin, etc.)', checked: false },
    { name: 'Food-Based (Milk, Soy, Nuts, Eggs, etc.)', checked: false },
    { name: 'Fragrances & Preservatives (Parabens, Alcohol, etc.)', checked: false },
    { name: 'Plant-Based (Lanolin, Coconut Oil, Essential Oils, etc.)', checked: false },
  ];

  constructor(private firestore: Firestore, private router: Router) {}

  // Handle file input for image selection
  selectImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.babyImage = e.target.result; // Save the image as base64
      };
      reader.readAsDataURL(file);
    }
  }

  showErrorMessage = false;

  // Create baby profile and upload image if available
  async createProfile() {
    // Validate required fields
    if (!this.babyName || !this.babyBirthdate || !this.gender) {
      this.showErrorMessage = true;
      return;
    }

    this.showErrorMessage = false;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in or missing email.');
      return;
    }

    const parentId = user.email?.toLowerCase();
    if (!parentId) {
      console.error('Parent ID not found. User might not be logged in.');
      return;
    }

    // Collect selected allergies
    const selectedAllergies = this.allergies
      .filter(a => a.checked)
      .map(a => a.name);
    if (this.customAllergy) selectedAllergies.push(this.customAllergy);

    // Create Firestore document for the baby
    const babyDoc = {
     babyId: this.babyName,  
     name: this.babyName,
     birthDate: this.babyBirthdate,
     gender: this.gender,
     allergies: selectedAllergies,
     isDefault: this.isDefault,
     profileImage: '',
     parentId: parentId  
    };

    const babyDocRef = doc(this.firestore, `Parents/${parentId}/babies/${this.babyName}`);
    await setDoc(babyDocRef, babyDoc);

    // Upload image to Firebase Storage and update document
    if (this.babyImage) {
      const storage = getStorage();
      const imgRef = ref(storage, `baby-profiles/${parentId}/${babyDocRef.id}.jpg`);
      await uploadString(imgRef, this.babyImage, 'data_url');
      const imageUrl = await getDownloadURL(imgRef);
      await updateDoc(babyDocRef, { profileImage: imageUrl });
    }

    this.router.navigate(['/select-baby']);
  }

  // Calendar state variables
  isCalendarOpen = false;
  babyBirthdate: string = '';
  showDateModal: boolean = false;

  // Handle calendar visibility
  openCalendar() {
    this.isCalendarOpen = true;
  }

  openDatePicker() {
    this.showDateModal = true;
  }

  closeCalendar() {
    this.isCalendarOpen = false;
  }

  // Handle date selection
  selectDate(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.babyBirthdate = selectedDate.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  }

  setBirthdate(event: any) {
    this.babyBirthdate = event.detail.value;
    this.showDateModal = false;
  }
goBack() {
      this.router.navigate(['/select-baby']);
}

}
