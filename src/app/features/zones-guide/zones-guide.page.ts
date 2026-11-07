import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  checkmarkDoneOutline,
  flameOutline,
  informationCircleOutline,
  sparklesOutline,
  speedometerOutline
} from 'ionicons/icons';

import { ZoneService } from '../../core/services/zone.service';

@Component({
  selector: 'app-zones-guide',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './zones-guide.page.html',
  styleUrls: ['./zones-guide.page.scss']
})
export class ZonesGuidePage {
  private zoneService = inject(ZoneService);
  zones = this.zoneService.getAllZones();

  constructor() {
    addIcons({
      chatbubblesOutline,
      checkmarkDoneOutline,
      flameOutline,
      informationCircleOutline,
      sparklesOutline,
      speedometerOutline
    });
  }
}