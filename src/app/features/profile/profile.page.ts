import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  medalOutline,
  notificationsOutline,
  ribbonOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  constructor() {
    addIcons({
      chevronForwardOutline,
      medalOutline,
      notificationsOutline,
      ribbonOutline,
      shieldCheckmarkOutline
    });
  }
}