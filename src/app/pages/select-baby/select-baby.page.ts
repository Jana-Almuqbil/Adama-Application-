import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth'; 

@Component({
  selector: 'app-select-baby',
  templateUrl: './select-baby.page.html',
  styleUrls: ['./select-baby.page.scss'],
  standalone: false,
})
export class SelectBabyPage implements OnInit {
  babyProfiles: any[] = [];

  constructor(private firestore: Firestore, private router: Router) {}

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
      console.error('User not logged in or email not found.');
      return;}
    
    const parentId = user.email.toLowerCase();
    if (!parentId) return;

    const babiesRef = collection(this.firestore, `Parents/${parentId}/babies`);
    const snapshot = await getDocs(babiesRef);

    this.babyProfiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  selectBaby(baby: any) {
    localStorage.setItem('selectedBabyId', baby.id);
    this.router.navigate(['/home']); 
  }

  goToCreateBaby() {
    this.router.navigate(['/create-baby']);
  }
}
