import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage {

  isFilterOpen = false;

  // All fetched records
  allRecords: any[] = [];

  // Current visible records
  historyRecords: any[] = [];

  // Filter flags
  statusFilters = {
    notVerified: false,
    pendingReview: false,
    openedByDoctor: false,
    verified: false,
  };

  searchText: string = '';

  constructor(private navCtrl: NavController, private firestore: Firestore) {}

  async ionViewWillEnter() {
    const babyId = localStorage.getItem('selectedBabyId');

    if (!babyId) {
      console.error('No baby ID found in localStorage');
      return;
    }
 
    const caseRef = collection(this.firestore, `New_Case/${babyId}/cases`);
    const snapshot = await getDocs(caseRef);

    this.historyRecords = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data['diseaseName'] || 'Unknown',
        date: new Date(data['timestamp']?.seconds * 1000).toLocaleDateString(),
        accuracy: parseFloat(data['confidence']).toFixed(0),
        status: data['status'] || 'Not specified',
        image: data['uploadedImage'] || 'assets/placeholder.jpg',
        symptoms: data['symptoms'] || [],
        treatmentName: data['treatmentName'] || 'No treatment found',
        instructions: data['instructions'] || 'No instructions available',
      };
    });

    this.allRecords = [...this.historyRecords];
    console.log('Fetched history:', this.historyRecords);
  }

  openFilterModal() {
    this.isFilterOpen = true;
  }

  closeFilterModal() {
    this.isFilterOpen = false;
  }

  goBack() {
    this.navCtrl.back();
  }

  applyFilter() {
    const filters = this.statusFilters;
    const activeFilters: string[] = [];
  
    if (filters.notVerified) activeFilters.push('Not Verified By Doctor');
    if (filters.pendingReview) activeFilters.push('Pending Review By Doctor');
    if (filters.openedByDoctor) activeFilters.push('Opened by Doctor Ahmed, and waiting for verification');
    if (filters.verified) activeFilters.push('Verified');
  
    if (activeFilters.length === 0) {
      // Show all if no filter is selected
      this.historyRecords = [...this.allRecords];
    } else {
      this.historyRecords = this.allRecords.filter(record =>
        activeFilters.includes(record.status)
      );
    }
    
    this.onSearchChange();
    this.closeFilterModal();
  }

  onSearchChange() {
    const searchTerm = this.searchText.toLowerCase().trim();
  
    // Filter from allRecords, considering active status filters if any
    const filters = this.statusFilters;
    const activeFilters: string[] = [];
  
    if (filters.notVerified) activeFilters.push('Not Verified By Doctor');
    if (filters.pendingReview) activeFilters.push('Pending Review By Doctor');
    if (filters.openedByDoctor) activeFilters.push('Opened by Doctor Ahmed, and waiting for verification');
    if (filters.verified) activeFilters.push('Verified');
  
    let filtered = this.allRecords;
  
    if (activeFilters.length > 0) {
      filtered = filtered.filter(record => activeFilters.includes(record.status));
    }
  
    // Apply text search on disease name
    this.historyRecords = filtered.filter(record =>
      record.name.toLowerCase().includes(searchTerm)
    );
  }
  
  openCase(record: any) {
    const babyId = localStorage.getItem('selectedBabyId');
    
    if (!babyId || !record.id) {
      console.error('Missing baby ID or case ID');
      return;
    }
  
    localStorage.setItem('selectedBabyId', babyId);
    localStorage.setItem('selectedCaseId', record.id);
  
    this.navCtrl.navigateForward('/report-verified-case');
  }
  
}