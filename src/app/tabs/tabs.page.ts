import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  flagOutline,
  homeOutline,
  personOutline,
  speedometerOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    IonTabs
  ],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {
  constructor() {
    addIcons({
      flagOutline,
      homeOutline,
      personOutline,
      speedometerOutline
    });
  }
}