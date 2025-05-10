import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,

})
export class ProfilePage implements OnInit {

  profile = {
    name: 'Naif Ahmed Alharbi',
    dob: '20 / 11 / 2024',
    gender: 'Male',
    allergies: 'Food-Based (Milk, Soy, Nuts, Eggs, etc.)',
  };

  constructor(private navCtrl: NavController, private router:Router) {}

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

  editParentInfo() {
    this.router.navigate(['/update-parent']);
  }
}
