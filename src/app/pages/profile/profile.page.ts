import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, collection, getDocs, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  parentProfile: any = {
    name: '',
    email: '',
    image: 'assets/mom.jpg',
  };

  babyProfile: any = {
    name: '',
    birthDate: '',
    gender: '',
    allergies: [],
    allergiesFormatted: '',
    image: 'assets/images/profile-avater.png',
  };

  babies: any[] = [];
  selectedBabyId: string = '';
  editMode = false;
  isCalendarOpen = false;
  allergies = [
    { name: 'Antibiotics (Neomycin, Bacitracin, Penicillin, etc.)', checked: false },
    { name: 'Food-Based (Milk, Soy, Nuts, Eggs, etc.)', checked: false },
    { name: 'Fragrances & Preservatives (Parabens, Alcohol, etc.)', checked: false },
    { name: 'Plant-Based (Lanolin, Coconut Oil, Essential Oils, etc.)', checked: false },
  ];

  constructor(private navCtrl: NavController, private router: Router, private firestore: Firestore) {}

  // Called every time the page becomes active
  async ionViewWillEnter() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const parentId = user.email.toLowerCase();
        await this.loadParentProfile(parentId);
        await this.loadBabies(parentId);

        const savedBabyId = localStorage.getItem('selectedBabyId');
        
        if (savedBabyId) {
          const selectedBaby = this.babies.find(baby => baby.id === savedBabyId);
          if (selectedBaby) {
            this.setBabyProfile(selectedBaby);
          } else {
            this.setBabyProfile(this.babies[0]);
          }
        } else {
          this.setBabyProfile(this.babies[0]);
        }
      }
    });
  }

  // Load parent (account owner) profile
  async loadParentProfile(parentId: string) {
    const parentRef = doc(this.firestore, `Parents/${parentId}`);
    const parentSnapshot = await getDoc(parentRef);
    if (parentSnapshot.exists()) {
      const data = parentSnapshot.data();
      this.parentProfile.name = data['Name'] || parentId.split('@')[0];
      this.parentProfile.email = data['Email'] || parentId;
      this.parentProfile.image = data['ProfileImageURL'] || 'assets/mom.jpg';
    }
  }

  // Load all babies under the parent
  async loadBabies(parentId: string) {
    const babiesRef = collection(this.firestore, `Parents/${parentId}/babies`);
    const babiesSnapshot = await getDocs(babiesRef);

    this.babies = babiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Load selected baby based on saved ID
  async loadSelectedBabyProfile() {
    const savedBabyId = localStorage.getItem('selectedBabyDocumentId');
    if (savedBabyId && this.babies.find(b => b.id === savedBabyId)) {
      this.setBabyProfile(this.babies.find(b => b.id === savedBabyId));
    } else if (this.babies.length > 0) {
      this.setBabyProfile(this.babies[0]);
    }
  }

  // Set the active baby profile
  setBabyProfile(baby: any) {
    this.selectedBabyId = baby.id;
    this.babyProfile.name = baby.name || 'No Name';
    this.babyProfile.birthDate = baby.birthDate || 'No Birthdate';
    this.babyProfile.gender = baby.gender || 'No Gender';
    this.babyProfile.image = baby.profileImage || 'assets/images/profile-avater.png';
    this.babyProfile.allergiesFormatted = (baby.allergies && baby.allergies.length > 0)
      ? baby.allergies.join(', ')
      : 'No allergies';
  }

  // Change the selected baby and update local storage
  selectBaby(baby: any) {
    this.setBabyProfile(baby);

    localStorage.setItem('selectedBabyId', baby.id);
    localStorage.setItem('selectedBabyName', baby.name);
    localStorage.setItem('selectedBabyImage', baby.profileImage || 'assets/images/profile-avater.png');
  }

  // Navigate to update parent info page
  editParentInfo() {
    this.router.navigate(['/update-parent']);
  }

  // Toggle edit mode for baby profile
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.saveBabyProfile();
    }
  }

  // Save changes made to the baby profile
  async saveBabyProfile() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user?.email) return;

    const parentId = user.email.toLowerCase();
    const babyRef = doc(this.firestore, `Parents/${parentId}/babies/${this.selectedBabyId}`);

    const updatedBaby = {
      name: this.babyProfile.name,
      birthDate: this.babyProfile.birthDate,
      gender: this.babyProfile.gender,
      allergies: this.babyProfile.allergiesFormatted.split(',').map((a: string) => a.trim()),
    };

    await updateDoc(babyRef, updatedBaby);
    console.log('Baby profile updated!');
  }

  // Delete the currently selected baby profile
  // Confirm and delete the currently selected baby profile
async deleteBabyProfile() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Confirm Deletion';
  alert.message = 'Are you sure you want to delete this baby profile?';
  alert.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'alert-cancel-button',
      handler: () => {
        console.log('Deletion canceled');
      }
    },
    {
      text: 'Delete',
      role: 'destructive',
      cssClass: 'alert-delete-button',
      handler: async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user?.email) return;

        const parentId = user.email.toLowerCase();
        const babyRef = doc(this.firestore, `Parents/${parentId}/babies/${this.selectedBabyId}`);

       
    try {
      await deleteDoc(babyRef);
      console.log('Deleted baby profile.');
      localStorage.removeItem('selectedBabyDocumentId');
      this.navCtrl.navigateRoot('/select-baby');
    } catch (error) {
      console.error('Failed deleting baby', error);
    }
      }
    }
  ];

  document.body.appendChild(alert);
  await alert.present();
}

  // Open date picker
  openCalendar() {
    this.isCalendarOpen = true;
  }

  // Close date picker
  closeCalendar() {
    this.isCalendarOpen = false;
  }

  // Set selected date
  selectDate(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.babyProfile.birthDate = selectedDate.toLocaleDateString('en-GB');
  }

  // Navigate back to Home page
  goBack() {
    this.router.navigate(['/home']);
  }
}
